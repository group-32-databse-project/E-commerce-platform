const db = require('../config/database');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

class Customer {
  static async getAllCustomers() {
    const [rows] = await db.query('SELECT * FROM customer');
    return rows;
  }

  static async getCustomerById(id) {
    const [rows] = await db.query('SELECT * FROM customer left outer join customer_phone_number using (customer_id) WHERE customer_id = ?', [id]);
    return rows[0];
  }

  static async createCustomer(customerData) {
    const { first_name, last_name, email_address, username, password } = customerData;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const [result] = await db.query(
      'INSERT INTO customer (first_name, last_name, email_address, username, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [first_name, last_name, email_address, username, hashedPassword]
    );
    return result.insertId;
  }

  static async getCustomerByEmail(email) {
    const [rows] = await db.query(
      "SELECT * FROM customer WHERE email_address = ?",
      [email]
    );
    return rows[0];
  }

  // Add more methods (update, delete, etc.)
}

module.exports = Customer;
