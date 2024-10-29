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
    order_status
  ) {
    const [result] = await db.query(
      `INSERT INTO shop_order (customer_id, delivery_module_id, order_date, payment_method_id, delivery_method, delivery_address_id, total_order_price, subtotal, shipping, tax, shipping_date, order_status) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, NULL, ?)`,
      [
        customer_id,
        delivery_module_id,
        payment_method_id,
        delivery_method,
        delivery_address_id,
        total_order_price,
        subtotal,
        shipping,
        tax,
        order_status,
      ]
    );
    return result.insertId; // Return the ID of the newly created order
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
      "SELECT * FROM shop_order WHERE customer_id = ?",
      [customerId]
    );
    return rows;
  }

  //getOrderById
  // Add more methods as needed
}

module.exports = Order;
