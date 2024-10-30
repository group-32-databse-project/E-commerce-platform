const db = require('../config/database');

class DeliveryModule {
  /**
   * Creates a new delivery module with the estimated arrival date.
   * @param {Date} estimated_arrival_date - The estimated arrival date.
   * @returns {Promise<number>} - The ID of the newly created delivery module.
   */
  static async createDeliveryModule(estimated_arrival_date) {
    try {
      const [result] = await db.query('CALL create_delivery_module(?)', [estimated_arrival_date]);
      // Assuming the stored procedure returns the insertId as the first result
      return result[0].insertId;
    } catch (error) {
      console.error('Error creating delivery module:', error);
      throw error;
    }
  }

  /**
   * Retrieves a delivery module by its ID.
   * @param {number} id - The ID of the delivery module.
   * @returns {Promise<Object>} - The delivery module object.
   */
  static async getDeliveryModuleById(id) {
    try {
      const [rows] = await db.query('CALL get_delivery_module_by_id(?)', [id]);
      // The result of a CALL is nested within an array
      return rows[0][0];
    } catch (error) {
      console.error(`Error fetching delivery module with ID ${id}:`, error);
      throw error;
    }
  }

  // Add more methods as needed
}

module.exports = DeliveryModule;