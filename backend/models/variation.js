const db = require("../config/database");

class Variation {
  static async getVariationByCategoryId(categoryId) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM variation WHERE category_id = ?", // SQL query string
        [categoryId] // Parameters array
      );
      return rows;
    } catch (error) {
      console.error("Error in getVariationByCategoryId:", error);
      throw error;
    }
  }

  // Add other methods as needed
}

module.exports = Variation;
