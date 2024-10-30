const db = require('../config/database');

class Banner {
  /**
   * Fetches a specified number of random available products within categories that have the given parent category ID using a stored procedure.
   * A product is available if it has at least one variant with inventory_stock > 0.
   * @param {number} parentCategoryId - The parent category ID to filter products.
   * @param {number} limit - The number of random products to fetch.
   * @returns {Promise<Array>} - List of available products.
   */
  static async getRandomAvailableProductsByParentCategory(parentCategoryId, limit = 3) {
    try {
      const [rows] = await db.query('CALL get_random_available_products_by_parent_category(?, ?)', [parentCategoryId, limit]);
      
      // Stored procedures in MySQL return results in an array of result sets.
      // The actual data is usually in the first element.
      return rows[0];
    } catch (error) {
      console.error('Error in Banner.getRandomAvailableProductsByParentCategory:', error);
      throw error;
    }
  }
}

module.exports = Banner;