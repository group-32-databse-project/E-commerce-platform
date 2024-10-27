import jsPDF from "jspdf";

function PdfGenerator(orderDetail, address, customerDetail) {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Helper function for centered text
    const centeredText = (text, y) => {
      const textWidth =
        (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      const x = (pageWidth - textWidth) / 2;
      doc.text(text, x, y);
    };

    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    centeredText(`Order Summary`, 20);
    doc.setFontSize(16);
    centeredText(`Order #${orderDetail.order_id}`, 30);

    // Customer and Order Info
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const infoY = 50;
    doc.text(
      `${customerDetail.first_name} ${customerDetail.last_name}`,
      20,
      infoY
    );
    doc.text(`${customerDetail.email_address}`, 20, infoY + 7);
    doc.text(
      `${address.address_line_1} ${address.address_line_2}`,
      20,
      infoY + 14
    );
    doc.text(
      `${address.city}, ${address.state} ${address.zip_code}`,
      20,
      infoY + 21
    );

    doc.text(
      `Order Date: ${new Date(orderDetail.order_date).toLocaleDateString()}`,
      pageWidth - 70,
      infoY
    );
    doc.text(
      `Order Status: ${orderDetail.order_status}`,
      pageWidth - 70,
      infoY + 7
    );
    doc.text(
      `Delivery: ${orderDetail.delivery_method}`,
      pageWidth - 70,
      infoY + 14
    );

    // Items table
    const tableY = 90;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, tableY, pageWidth - 40, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Item", 25, tableY + 7);
    doc.text("Qty", 120, tableY + 7);
    doc.text("Price", 150, tableY + 7);
    doc.text("Total", 180, tableY + 7);

    // Add each item
    let y = tableY + 15;
    doc.setFont("helvetica", "normal");
    orderDetail.items &&
      orderDetail.items.forEach((item, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(20, y - 5, pageWidth - 40, 10, "F");
        }
        doc.text(item.name, 25, y);
        doc.text(item.quantity.toString(), 120, y);
        doc.text(`$${item.price.toFixed(2)}`, 150, y);
        doc.text(`$${(item.quantity * item.price).toFixed(2)}`, 180, y);
        y += 10;
      });

    // Order Summary
    const summaryY = y + 10;
    doc.line(20, summaryY, pageWidth - 20, summaryY);
    doc.text("Subtotal:", 130, summaryY + 10);
    doc.text(`$${orderDetail.subtotal.toFixed(2)}`, 180, summaryY + 10);
    doc.text("Shipping:", 130, summaryY + 20);
    doc.text(`$${orderDetail.shipping.toFixed(2)}`, 180, summaryY + 20);
    doc.text("Tax:", 130, summaryY + 30);
    doc.text(`$${orderDetail.tax.toFixed(2)}`, 180, summaryY + 30);
    doc.setFont("helvetica", "bold");
    doc.text("Total:", 130, summaryY + 40);
    doc.text(
      `$${orderDetail.total_order_price.toFixed(2)}`,
      180,
      summaryY + 40
    );

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    centeredText(
      "Thank you for your order!",
      doc.internal.pageSize.height - 20
    );

    // Save the PDF
    doc.save(`Order_${orderDetail.order_id}.pdf`);
  };

  generatePDF();
}

export default PdfGenerator;
