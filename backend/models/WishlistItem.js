const db = require('../config/database');

class WishlistItem {
  static async addItem(customerId, productId) {
    try {
      const [result] = await db.query(
        'INSERT INTO wishlist_item (customer_id, product_id) VALUES (?, ?)',
        [customerId, productId]
      );
      return result.insertId;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Item already exists in wishlist');
      }
      throw error;
    }
  }

  static async removeItem(customerId, productId) {
    const [result] = await db.query(
      'DELETE FROM wishlist_item WHERE customer_id = ? AND product_id = ?',
      [customerId, productId]
    );
    return result.affectedRows;
  }

  static async getWishlist(customerId) {
    const [rows] = await db.query(
      `SELECT p.*, wi.added_at
       FROM wishlist_item wi
       JOIN product p ON wi.product_id = p.product_id
       WHERE wi.customer_id = ?`,
      [customerId]
    );
    return rows;
  }

  static async isItemInWishlist(customerId, productId) {
    const [rows] = await db.query(
      'SELECT * FROM wishlist_item WHERE customer_id = ? AND product_id = ?',
      [customerId, productId]
    );
    return rows.length > 0;
  }
}

module.exports = WishlistItem;

