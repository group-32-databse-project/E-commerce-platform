const db = require('../config/database');

class PhoneNumber {
  static async save(number, id) {
    console.log('Saving phone number:', number, '  ', id);
    try {
      console.log('Saving phone number:', number, '  ', id);
      if (!number || !id) {
        throw new Error('Phone number and customer ID are required');
      }
      id = parseInt(id);
      const query = 'CALL insert_phone_number (?, ?)';
      const [result] = await db.execute(query, [ id,number]);
      console.log('Phone number saved successfully:', result);
      return result.insertId;
    } catch (error) {
      console.error('Error saving phone number:', error);
      throw error;
    }
  }

  static async getPhoneNumbers() {
    try {
      const [rows] = await db.query('SELECT * FROM customer_phone_number');
      return rows;
    } catch (error) {
      console.error('Error retrieving phone numbers:', error);
      throw error;
    }
  }
}

module.exports = PhoneNumber;