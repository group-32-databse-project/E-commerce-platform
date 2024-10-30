const db = require('../config/database');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

class Customer {
  static async getAllCustomers() {
    const [rows] = await db.query('SELECT * FROM customer');
    return rows;
  }

   /**
   * Fetches a customer by their ID using the `get_customer_by_id` stored procedure.
   * @param {number} id - The ID of the customer.
   * @returns {Promise<Object>} - The customer object including phone numbers.
   */
   static async getCustomerById(id) {
    try {
      const [rows] = await db.query('CALL get_customer_by_id(?)', [id]);
      return rows[0][0];
    } catch (error) {
      console.error('Error in Customer.getCustomerById:', error);
      throw error;
    }
  }

   /**
   * Creates a new customer using the `create_customer` stored procedure.
   * @param {Object} customerData - The customer data.
   * @param {string} customerData.first_name - First name.
   * @param {string} customerData.last_name - Last name.
   * @param {string} customerData.email_address - Email address.
   * @param {string} customerData.username - Username.
   * @param {string} customerData.password - Password (plaintext).
   * @returns {Promise<number>} - The ID of the newly created customer.
   */
   static async createCustomer(customerData) {
    const { first_name, last_name, email_address, username, password } = customerData;
    try {
      // Hash the plaintext password before storing
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const [result] = await db.query(
        'CALL create_customer(?, ?, ?, ?, ?)', 
        [first_name, last_name, email_address, username, hashedPassword]
      );

      // Depending on your MySQL configuration, retrieve the insertId appropriately
      const insertId = result[0]?.insertId || result[0]?.customer_id;
      return insertId;
    } catch (error) {
      console.error('Error in Customer.createCustomer:', error);
      throw error;
    }
  }

  static async getCustomerByEmail(email) {
    const [rows] = await db.query(
      "SELECT * FROM customer WHERE email_address = ?",
      [email]
    );
    return rows[0];
  }

  /**
   * Fetches payment details by customer ID using the `get_payment_details_by_customer_id` stored procedure.
   * @param {number} id - The ID of the customer.
   * @returns {Promise<Object>} - Payment details.
   */
  static async getPaymentDetailsByCustomerId(id) {
    try {
      const [rows] = await db.query('CALL get_payment_details_by_customer_id(?)', [id]);
      return rows[0][0];
    } catch (error) {
      console.error('Error in Customer.getPaymentDetailsByCustomerId:', error);
      throw error;
    }
  }

  /**
   * Updates an existing customer using the `update_customer` stored procedure.
   * @param {number} id - The ID of the customer to update.
   * @param {Object} customerData - The updated customer data.
   * @param {string} customerData.first_name - First name.
   * @param {string} customerData.last_name - Last name.
   * @param {string} customerData.email_address - Email address.
   * @returns {Promise<number>} - Number of affected rows.
   */
  static async updateCustomer(id, customerData) {
    const { first_name, last_name, email_address } = customerData;
    try {
      const [result] = await db.query('CALL update_customer(?, ?, ?, ?)', 
        [id, first_name, last_name, email_address]);
      const affectedRows = result[0]?.affected_rows;
      return affectedRows;
    } catch (error) {
      console.error('Error in Customer.updateCustomer:', error);
      throw error;
    }
  }
  // Add more methods (update, delete, etc.)
}

module.exports = Customer;
