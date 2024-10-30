
const db = require('../config/database');

class Category {
  static async getAllCategories() {
    const [rows] = await db.query("SELECT * FROM category");
    return rows;
  }

  static async getCategoryById(id) {
    console.log('getCategoryById id:', id); // Add this line to log the id
    const [rows] = await db.query('SELECT * FROM category WHERE category_id = ?', [id]);
    console.log('getCategoryById rows:', rows);
    return rows[0];
  }

  static async getElecs() {
    const [rows] = await db.query('SELECT * FROM category WHERE parent_category_id = 2');
    console.log('getElecs rows:', rows);
    return rows;
  }

  static async getToys() {
    const [rows] = await db.query('SELECT * FROM category WHERE parent_category_id = 1');
    console.log('getToys rows:', rows);
    return rows;
  }

  static async getToysAndElectronics() {
    const [rows] = await db.query('SELECT * FROM category WHERE category_id IN (1, 2)');
    console.log('getToysAndElectronics rows:', rows);
    return rows;
   
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
