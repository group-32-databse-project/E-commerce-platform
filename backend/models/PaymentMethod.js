const db = require('../config/database');

class PaymentMethod {
  static async getPayments() {
    const [rows] = await db.query("SELECT * FROM payment_method");
    return rows;
  }

  static async getPaymentMethodById(id) {
    const [rows] = await db.query(
      "SELECT * FROM payment_method WHERE payment_method_id = ?",
      [id]
    );
    return rows[0];
  }

  // Add more methods as needed
}

module.exports = PaymentMethod;