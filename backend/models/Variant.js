const db = require('../config/database');

class Variant {
  static async getVariantsByProductId(productId) {
    const [rows] = await db.query(
      "SELECT * FROM variant WHERE product_id = ?",
      [productId]
    );
    return rows;
  }

  static async createVariant(variantData) {
    const { product_id, inventory_stock, total_price, variant_image, SKU } =
      variantData;
    const [result] = await db.query(
      "INSERT INTO variant (product_id, inventory_stock, total_price, variant_image, SKU) VALUES (?, ?, ?, ?, ?)",
      [product_id, inventory_stock, total_price, variant_image, SKU]
    );
    return result.insertId;
  }

  static async updateInventory(variantId, quantityChange) {
    const [result] = await db.query(
      "UPDATE variant SET inventory_stock = inventory_stock + ? WHERE variant_id = ?",
      [quantityChange, variantId]
    );
    return result.affectedRows;
  }

  // Add more methods as needed
}

module.exports = Variant;