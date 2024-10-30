const db = require('../config/database');

class PaymentMethod {
  static async getPayments() {
    const [rows] = await db.query("CALL GetAllPayments()");
    return rows[0];
  }

  static async getPaymentMethodById(id) {
    const [rows] = await db.query("CALL GetPaymentMethodById(?)", [id]);
    return rows[0][0];
  }

  // Add more methods as needed
}

module.exports = PaymentMethod;
