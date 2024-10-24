const db = require('../config/database');

class Category {
  static async getAllCategories() {
    const [rows] = await db.query("SELECT * FROM category");
    return rows;
  }

  static async getCategoryById(id) {
    const [rows] = await db.query(
      "SELECT category_id FROM product WHERE product_id = ?",
      [id]
    );
    return rows[0];
  }

  static async createCategory(categoryData) {
    const { category_name, parent_category_id, category_image } = categoryData;
    const [result] = await db.query(
      "INSERT INTO category (category_name, parent_category_id, category_image) VALUES (?, ?, ?)",
      [category_name, parent_category_id, category_image]
    );
    return result.insertId;
  }
}

module.exports = Category;