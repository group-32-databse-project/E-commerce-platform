const db = require('../config/database');

class ShoppingCartItem {
  static async addItem(cartId, variantId, quantity) {
    const [rows] = await db.query(
      "SELECT * FROM shopping_cart_item WHERE shopping_cart_id = ? AND variant_id = ?",
      [cartId, variantId]
    );

    if (rows.length > 0) {
      // Update quantity
      await db.query(
        "UPDATE shopping_cart_item SET quantity = quantity + ? WHERE shopping_cart_item_id = ?",
        [quantity, rows[0].shopping_cart_item_id]
      );
    } else {
      // Insert new item

      await db.query(
        "INSERT INTO shopping_cart_item (shopping_cart_id, variant_id, quantity) VALUES (?, ?, ?)",
        [cartId, variantId, quantity]
      );
    }
  }

  static async changeQuantity(cartId, variantId, change) {
    const [rows] = await db.query(
      "SELECT * FROM shopping_cart_item WHERE shopping_cart_id = ? AND variant_id = ?",
      [cartId, variantId]
    );

    if (rows.length > 0) {
      await db.query(
        "UPDATE shopping_cart_item SET quantity = quantity + ? WHERE shopping_cart_item_id = ?",
        [change, rows[0].shopping_cart_item_id]
      );
    }
  }
  static async getItemsByCartId(cartId) {
    const [rows] = await db.query(
      `SELECT sci.*, v.total_price, p.product_name
       FROM shopping_cart_item sci
       JOIN variant v ON sci.variant_id = v.variant_id
       JOIN product p ON v.product_id = p.product_id
       WHERE sci.shopping_cart_id = ?`,
      [cartId]
    );
    return rows;
  }

  static async removeItem(shoppingCartItemId) {
    await db.query(
      "DELETE FROM shopping_cart_item WHERE shopping_cart_item_id = ?",
      [shoppingCartItemId]
    );
  }

  static async clearCart(cartId) {
    await db.query(
      "DELETE FROM shopping_cart_item WHERE shopping_cart_id = ?",
      [cartId]
    );
  }

  // Add more methods as needed
}

module.exports = ShoppingCartItem;



