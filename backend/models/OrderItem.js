const db = require("../config/database");

class OrderItem {
  static async getItemsByOrderId(orderId) {
    const [rows] = await db.query(
      "SELECT * FROM order_item WHERE order_id = ?",
      [orderId]
    );
    return rows;
  }

  // Add more methods as needed
}

module.exports = OrderItem;
