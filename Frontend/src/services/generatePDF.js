import jsPDF from "jspdf";

function PdfGenerator(orderDetail, address, customerDetail) {
  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;

      // Helper function for centered text with logging
      const centeredText = (text, y) => {
        if (typeof text !== "string" && typeof text !== "number") {
          console.error(`centeredText: Invalid text -`, text);
          text = "";
        }
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
      centeredText(`Order #${orderDetail.order_id || "N/A"}`, 30);

      // Customer and Order Info
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const infoY = 50;

      const customerName = `${customerDetail.first_name || ""} ${
        customerDetail.last_name || ""
      }`;
      console.log("Customer Name:", customerName);
      doc.text(customerName, 20, infoY);

      const email = customerDetail.email_address || "N/A";
      console.log("Customer Email:", email);
      doc.text(email, 20, infoY + 7);

      const addressLine1 = address.address_line1 || "";
      const addressLine2 = address.address_line2 || "";
      console.log("Address Line 1:", addressLine1);
      console.log("Address Line 2:", addressLine2);
      doc.text(`${addressLine1} ${addressLine2}`, 20, infoY + 14);

      const city = address.city || "";
      const state = address.state || "";
      const zip = address.zip_code || "";
      console.log("City:", city, "State:", state, "ZIP:", zip);
      doc.text(`${city}, ${state} ${zip}`, 20, infoY + 21);

      const orderDate = orderDetail.order_date
        ? new Date(orderDetail.order_date).toLocaleDateString()
        : "N/A";
      const orderDateText = `Order Date: ${orderDate}`;
      console.log("Order Date:", orderDateText);
      doc.text(orderDateText, pageWidth - 70, infoY);

      const orderStatus = orderDetail.order_status || "N/A";
      console.log("Order Status:", orderStatus);
      doc.text(`Order Status: ${orderStatus}`, pageWidth - 70, infoY + 7);

      const deliveryMethod = orderDetail.delivery_method || "N/A";
      console.log("Delivery Method:", deliveryMethod);
      doc.text(`Delivery: ${deliveryMethod}`, pageWidth - 70, infoY + 14);

      // Items table
      const tableY = 90;
      doc.setFillColor(240, 240, 240);
      doc.rect(20, tableY, pageWidth - 40, 10, "F");
      doc.setFont("helvetica", "bold");
      doc.text("Item", 25, tableY + 7);
      doc.text("Qty", 120, tableY + 7);
      doc.text("Price", 150, tableY + 7);
      doc.text("Total", 180, tableY + 7);

      // Add each item with logging
      let y = tableY + 15;
      doc.setFont("helvetica", "normal");
      if (orderDetail.items && Array.isArray(orderDetail.items)) {
        orderDetail.items.forEach((item, index) => {
          if (index % 2 === 0) {
            doc.setFillColor(250, 250, 250);
            doc.rect(20, y - 5, pageWidth - 40, 10, "F");
          }

          const itemName = item.name || "N/A";
          const itemQty =
            item.quantity != null ? item.quantity.toString() : "0";
          const itemPrice = item.price != null ? `$${item.price}` : "$0.00";
          const itemTotal =
            item.quantity != null && item.price != null
              ? `$${(item.quantity * item.price).toFixed(2)}`
              : "$0.00";

          console.log(`Adding item ${index + 1}:`, {
            itemName,
            itemQty,
            itemPrice,
            itemTotal,
          });

          // Validate arguments before passing to jsPDF.text
          if (
            (typeof itemName === "string" || typeof itemName === "number") &&
            (typeof itemQty === "string" || typeof itemQty === "number") &&
            (typeof itemPrice === "string" || typeof itemPrice === "number") &&
            (typeof itemTotal === "string" || typeof itemTotal === "number")
          ) {
            doc.text(itemName, 25, y);
            doc.text(itemQty, 120, y);
            doc.text(itemPrice, 150, y);
            doc.text(itemTotal, 180, y);
          } else {
            console.error(`Invalid item data for item ${index + 1}:`, item);
          }
          y += 10;
        });
      } else {
        console.error("No items found in orderDetail");
      }

      // Order Summary
      const summaryY = y + 10;
      doc.line(20, summaryY, pageWidth - 20, summaryY);
      console.log(
        "Subtotal:",
        orderDetail.subtotal,
        typeof orderDetail.subtotal
      );

      // Safer number formatting with fallback to 0
      const formatPrice = (value) => {
        if (value === null || value === undefined) return "0.00";
        const num = parseFloat(value);
        return isNaN(num) ? "0.00" : num.toFixed(2);
      };

      console.log("Formatting prices...");
      doc.text("Subtotal:", 130, summaryY + 10);
      doc.text(`$${formatPrice(orderDetail.subtotal)}`, 180, summaryY + 10);
      doc.text("Shipping:", 130, summaryY + 20);
      doc.text(`$${formatPrice(orderDetail.shipping)}`, 180, summaryY + 20);
      doc.text("Tax:", 130, summaryY + 30);
      doc.text(`$${formatPrice(orderDetail.tax)}`, 180, summaryY + 30);
      doc.setFont("helvetica", "bold");
      doc.text("Total:", 130, summaryY + 40);
      doc.text(
        `$${formatPrice(orderDetail.total_order_price)}`,
        180,
        summaryY + 40
      );

      // Footer
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      const footerText = "Thank you for your order!";
      const footerY = doc.internal.pageSize.height - 20;
      centeredText(footerText, footerY);

      // Save the PDF
      doc.save(`Order_${orderDetail.order_id || "N/A"}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      console.error("Error details:", {
        orderDetail,
        address,
        customerDetail,
      });
    }
  };

  generatePDF();
}

export default PdfGenerator;
