const db = require('../config/database');

class Product {
  static async getAllProducts() {
    const [rows] = await db.query("SELECT * FROM product");
    return rows;
  }

  static async getProductById(id) {
    const [rows] = await db.query(
      "SELECT * FROM product WHERE product_id = ?",
      [id]
    );
    
    return rows[0];
  }

  static async createProduct(productData) {
    const { category_id, product_name, description, product_image, weight } =
      productData;
    const [result] = await db.query(
      "INSERT INTO product (category_id, product_name, description, product_image, weight) VALUES (?, ?, ?, ?, ?)",
      [category_id, product_name, description, product_image, weight]
    );
    return result.insertId;
  }

  // Add more methods as needed (update, delete, etc.)
}

module.exports = Product;