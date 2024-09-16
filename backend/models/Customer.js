const db = require('../config/database');

class Customer {
  static async getAllCustomers() {
    const [rows] = await db.query('SELECT * FROM customer');
    return rows;
  }

  static async getCustomerById(id) {
    const [rows] = await db.query('SELECT * FROM customer WHERE customer_id = ?', [id]);
    return rows[0];
  }

  static async createCustomer(customerData) {
    const { first_name, last_name, email_address, username, password } = customerData;
    const [result] = await db.query(
      'INSERT INTO customer (first_name, last_name, email_address, username, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [first_name, last_name, email_address, username, password]
    );
    return result.insertId;
  }

  // Add more methods (update, delete, etc.)
}

module.exports = Customer;