const db = require('../config/database');

class Address {
  /**
   * Retrieves all addresses associated with a given customer ID using a stored procedure.
   * @param {number} customerId - The ID of the customer.
   * @returns {Promise<Array>} - A promise that resolves to an array of address objects.
   */
  static async getAddressesByCustomerId(customerId) {
    try {
      const [rows] = await db.query('CALL get_addresses_by_customer_id(?)', [customerId]);
      
      // Stored procedures in MySQL return results in an array of result sets.
      // The actual data is usually in the first element.
      return rows[0];
    } catch (error) {
      console.error("Error in getAddressesByCustomerId:", error);
      throw error;
    }
  }

  /**
   * Creates a new address using a stored procedure.
   * @param {Object} formData - The address data.
   * @param {string} formData.address_line1 - The first line of the address.
   * @param {string} formData.address_line2 - The second line of the address (optional).
   * @param {string} formData.city - The city of the address.
   * @param {string} formData.postal_code - The postal code.
   * @param {boolean} formData.is_main_city - Indicates if it's the main city.
   * @returns {Promise<number>} - A promise that resolves to the inserted address ID.
   */
  static async createAddress(formData) {
    console.log("formData");
    console.log(formData);
    const { address_line1, address_line2, city, postal_code, is_main_city } = formData;
    try {
      const [result] = await db.query(
        'CALL create_address(?, ?, ?, ?, ?)',
        [address_line1, address_line2, city, postal_code, is_main_city]
      );
      
      // Retrieve the inserted ID from the result set
      const insertId = result[0]?.insertId;
      return insertId;
    } catch (error) {
      console.error("Error in createAddress:", error);
      throw error;
    }
  }

  // Add more methods as needed
}

module.exports = Address;