const db = require('../utils/db');

const Admin = {
  /**
   * Creates a new admin user using a stored procedure.
   * @param {Object} adminData - The admin data.
   * @param {string} adminData.username - The username.
   * @param {string} adminData.email - The email.
   * @param {string} adminData.password - The password.
   * @returns {Promise<number>} - A promise that resolves to the inserted admin ID.
   */
  createAdmin: async (adminData) => {
    const { username, email, password } = adminData;
    try {
      const [result] = await db.query('CALL create_admin(?, ?, ?)', [username, email, password]);
      
      // Retrieve the inserted ID from the result set
      const insertId = result[0]?.insertId;
      return insertId;
    } catch (error) {
      console.error("Error in createAdmin:", error);
      throw error;
    }
  },

  /**
   * Retrieves an admin user by email using a stored procedure.
   * @param {string} email - The email of the admin.
   * @returns {Promise<Object>} - A promise that resolves to the admin object.
   */
  getAdminByEmail: async (email) => {
    try {
      const [rows] = await db.query('CALL get_admin_by_email(?)', [email]);

      // Stored procedures in MySQL return results in an array of result sets.
      // The actual data is usually in the first element.
      return rows[0][0];
    } catch (error) {
      console.error("Error in getAdminByEmail:", error);
      throw error;
    }
  },

  /**
   * Retrieves an admin user by ID using a stored procedure.
   * @param {number} id - The ID of the admin.
   * @returns {Promise<Object>} - A promise that resolves to the admin object.
   */
  getAdminById: async (id) => {
    try {
      const [rows] = await db.query('CALL get_admin_by_id(?)', [id]);

      // Stored procedures in MySQL return results in an array of result sets.
      // The actual data is usually in the first element.
      return rows[0][0];
    } catch (error) {
      console.error("Error in getAdminById:", error);
      throw error;
    }
  }
};

module.exports = Admin;