const db = require('../config/database');

class Order {
  static async createOrder(
    customer_id,
    delivery_module_id,
    payment_method_id,
    delivery_method,
    delivery_address_id,
    total_order_price,
    subtotal,
    shipping,
    tax,
    shipping_date,
    order_status,
    discount
  ) {
    const [result] = await db.query(
      `INSERT INTO shop_order (
        customer_id, 
        delivery_module_id,
        order_date,
        payment_method_id,
        delivery_method,
        delivery_address_id,
        total_order_price,
        subtotal,
        shipping,
        tax,
        shipping_date,
        order_status,
        discount
      ) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_id,
        delivery_module_id,
        payment_method_id,
        delivery_method,
        delivery_address_id,
        total_order_price,
        subtotal,
        shipping,
        parseFloat(tax || 0),
        shipping_date,
        order_status,
        discount,
      ]
    );
    return result.insertId;
  }

  static async getOrderById(orderId) {
    const [rows] = await db.query(
      "SELECT * FROM shop_order WHERE order_id = ?",
      [orderId]
    );
    return rows[0];
  }

  static async getOrdersByCustomerId(customerId) {
   
    
    const [rows] = await db.query(
      `SELECT 
         *
       FROM shop_order 
       LEFT JOIN order_item ON shop_order.order_id = order_item.order_id 
       LEFT JOIN variant ON order_item.variant_id = variant.variant_id 
       LEFT JOIN product ON variant.product_id = product.product_id 
       WHERE shop_order.user_id = ?  and  order_item.order_item_id>0`, 
      [customerId]
    );
    console.log('rows:', rows);
  
    // Process the results to group items under their respective orders
   
    return rows;
  }
  

  static async getOrdersByCustomerId(customerId) {
    const [rows] = await db.query(
      "SELECT * FROM shop_order WHERE customer_id = ?",
      [customerId]
    );
    return rows;
  }

  //getOrderById
  // Add more methods as needed
}

module.exports = Order;
