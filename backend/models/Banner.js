const db = require('../config/database');

class Banner {
  /**
   * Fetches a specified number of random available products within categories that have the given parent category ID.
   * A product is available if it has at least one variant with inventory_stock > 0.
   * @param {number} parentCategoryId - The parent category ID to filter products.
   * @param {number} limit - The number of random products to fetch.
   * @returns {Promise<Array>} - List of available products.
   */
  static async getRandomAvailableProductsByParentCategory(parentCategoryId, limit = 3) {
    try {
      const query = `
        SELECT DISTINCT p.product_id, p.product_name, p.description, p.product_image, p.weight
        FROM product p
        JOIN variant v ON p.product_id = v.product_id
        JOIN category c ON p.category_id = c.category_id
        WHERE c.parent_category_id = ?
          AND v.inventory_stock > 0
        ORDER BY RAND()
        LIMIT ?
      `;
      const [rows] = await db.query(query, [parentCategoryId, limit]);
      return rows;
    } catch (error) {
      console.error('Error in Banner.getRandomAvailableProductsByParentCategory:', error);
      throw error;
    }
  }
}

module.exports = Banner;