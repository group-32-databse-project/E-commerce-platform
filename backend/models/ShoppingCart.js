const db = require('../config/database');

class ShoppingCart {
  static async createCart(customerId) {
    const [result] = await db.query(
      "INSERT INTO shopping_cart (customer_id, created_at, updated_at) VALUES (?, NOW(), NOW())",
      [customerId]
    );
    return result.insertId;
  }

  static async getCartByCustomerId(customerId) {
    const [rows] = await db.query(
      "SELECT * FROM shopping_cart WHERE customer_id = ? ",
      [customerId]
    );
    return rows[0];
  }

  static async updateCart(cartId) {
    await db.query(
      "UPDATE shopping_cart SET updated_at = NOW() WHERE shopping_cart_id = ?",
      [cartId]
    );
  }

  // Add more methods as needed
}

module.exports = ShoppingCart;