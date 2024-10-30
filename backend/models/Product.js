const db = require('../config/database');

class Product {
  static async getAllProducts() {
    const [rows] = await db.query("SELECT * FROM product");
    return rows;
  }
  
  static async getProductsByCategory(categoryId) {
    try {
      console.log('Fetching products for category ID:', categoryId);
      const query = 'SELECT * FROM product WHERE category_id = ?'; // Ensure table name is correct
      const values = [categoryId];
      const [rows] = await db.query(query, values);
      return rows;
    } catch (error) {
      console.error('Error in getProductsByCategory:', error);
      throw error;
    }
  }

  static async getProductById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM product WHERE product_id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error in getProductById:', error);
      throw error;
    }
  }

  static async getProductVariantsById(categoryId) {
    try {
      const [rows] = await db.query('SELECT * FROM product WHERE category_id = ?', [categoryId]);
      return rows;
    } catch (error) {
      console.error('Error in getProductVariantsById:', error);
      throw error;
    }
  }

  static async createProduct(productData) {
    try {
      const { category_id, product_name, description, product_image, weight } = productData;
      const [result] = await db.query(
        'INSERT INTO product (category_id, product_name, description, product_image, weight) VALUES (?, ?, ?, ?, ?)',
        [category_id, product_name, description, product_image, weight]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error in createProduct:', error);
      throw error;
    }
  }

  // Add more methods as needed (update, delete, etc.)
}

module.exports = Product;