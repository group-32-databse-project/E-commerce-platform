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

  static async getPaymentDetailsByCustomerId(id) {
    const [rows] = await db.query('SELECT concat(first_name," ",last_name) as name ,cp.* FROM customer_payment_method cp left outer join customer c using(customer_id) WHERE cp.customer_id = ?', [id]);
    console.log('rows:', rows);
    return rows[0];

  }
  static async updateCustomer(id, customerData) {
    console.log('customerData at back:', customerData);
    const { first_name, last_name, email_address } = customerData;
    const [result] = await db.query(
      'UPDATE customer SET first_name = ?, last_name = ?, email_address = ?, updated_at = NOW() WHERE customer_id = ?',
      [first_name, last_name, email_address,id]
    );
    return result.affectedRows;
  }
  // Add more methods (update, delete, etc.)
}

module.exports = Customer;
