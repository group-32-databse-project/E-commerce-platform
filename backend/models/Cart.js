const db = require("../config/database");

class Cart {
  static async getCartIdByCustomerId(customer_id) {
    const [rows] = await db.query(
      "SELECT * FROM shopping_cart WHERE customer_id = ?",
      [customer_id]
    );
    return rows[0];
  }
}
module.exports = Cart;
