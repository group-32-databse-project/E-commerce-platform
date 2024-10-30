const db = require("../config/database");

class CustomerAddress {
  /**
   * Creates a new customer address using the `create_customer_address` stored procedure.
   * @param {number} customerId - The ID of the customer.
   * @param {number} addressId - The ID of the address.
   * @returns {Promise<number>} - The ID of the newly created customer address (if applicable).
   */
  static async createCustomerAddress(customerId, addressId) {
    try {
      const [result] = await db.query(
        'CALL create_customer_address(?, ?)',
        [customerId, addressId]
      );
      
      // Retrieve the inserted ID from the result set, if returned
      const insertId = result[0]?.insertId;
      return insertId;
    } catch (error) {
      console.error('Error in CustomerAddress.createCustomerAddress:', error);
      throw error;
    }
  }
}

module.exports = CustomerAddress;