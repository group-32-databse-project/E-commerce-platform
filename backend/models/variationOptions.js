const db = require("../config/database");

class VariationOptions {
  static async getOptionsByVariationId(variationId) {
    const [rows] = await db.query(
      "SELECT * FROM variation_option WHERE variation_id = ?",
      [variationId]
    );
    return rows;
  }
}

module.exports = VariationOptions;
