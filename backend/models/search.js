const db = require('../config/database');

class Search {
  static async getSearchResults(searchTerm) {
    console.log(searchTerm);
    const [rows] = await db.query(
      `SELECT product_id,product_name FROM product WHERE product_name LIKE ?`,
      [`%${searchTerm}%`]
    );
    return rows;
  }
}

module.exports = Search;