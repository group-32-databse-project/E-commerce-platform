const db = require('../config/database');

class Category {
  static async getAllCategories() {
    const [rows] = await db.query('SELECT * FROM category');
    return rows;
  }

  static async getCategoryById(id) {
    const [rows] = await db.query('SELECT * FROM category WHERE category_id = ?', [id]);
    return rows[0];
  }

  static async getEleAndToy() {
    const [rows] = await db.query('SELECT * FROM category WHERE parent_category_id = 1 OR parent_category_id = 2');
    return rows;
  }

  // Add more methods as needed
}

module.exports = Category;