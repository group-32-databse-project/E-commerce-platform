const db = require('../config/database');

class Category {
  /**
   * Fetches all categories using the `get_all_categories` stored procedure.
   * @returns {Promise<Array>} - List of all categories.
   */
  static async getAllCategories() {
    try {
      const [rows] = await db.query('CALL get_all_categories()');
      return rows[0];
    } catch (error) {
      console.error('Error in Category.getAllCategories:', error);
      throw error;
    }
  }

  /**
   * Fetches a category by its ID using the `get_category_by_id` stored procedure.
   * @param {number} id - The ID of the category.
   * @returns {Promise<Object>} - The category object.
   */
  static async getCategoryById(id) {
    try {
      const [rows] = await db.query('CALL get_category_by_id(?)', [id]);
      return rows[0][0];
    } catch (error) {
      console.error('Error in Category.getCategoryById:', error);
      throw error;
    }
  }

  /**
   * Fetches categories by their parent category ID using the `get_categories_by_parent_id` stored procedure.
   * @param {number} parentId - The parent category ID.
   * @returns {Promise<Array>} - List of categories under the specified parent category.
   */
  static async getCategoriesByParentId(parentId) {
    try {
      const [rows] = await db.query('CALL get_categories_by_parent_id(?)', [parentId]);
      return rows[0];
    } catch (error) {
      console.error('Error in Category.getCategoriesByParentId:', error);
      throw error;
    }
  }

  /**
   * Creates a new category using the `create_category` stored procedure.
   * @param {Object} categoryData - The category details.
   * @param {string} categoryData.category_name - The name of the category.
   * @param {number} categoryData.parent_category_id - The parent category ID.
   * @param {string} categoryData.category_image - The image URL of the category.
   * @returns {Promise<number>} - The ID of the newly created category.
   */
  static async createCategory(categoryData) {
    const { category_name, parent_category_id, category_image } = categoryData;
    try {
      const [result] = await db.query(
        'CALL create_category(?, ?, ?)', 
        [category_name, parent_category_id, category_image]
      );
      
      // Retrieve the inserted ID from the result set
      const insertId = result[0]?.insertId;
      return insertId;
    } catch (error) {
      console.error('Error in Category.createCategory:', error);
      throw error;
    }
  }

  // ... (Other methods like getElecs, getToys, getToysAndElectronics can be refactored similarly if needed)
}

module.exports = Category;