const db = require("../config/database");

class Card {
  /**
   * Saves a new card for a customer using a stored procedure.
   * @param {number} customerId - The ID of the customer.
   * @param {Object} card - The card details.
   * @param {string} card.last_four_digits - The last four digits of the card.
   * @param {string} card.expiration_date - The expiration date of the card (YYYY-MM-DD).
   * @param {string} card.card_owner - The name of the card owner.
   * @param {string} card.card_number - The full card number.
   * @returns {Promise<number>} - A promise that resolves to the inserted card ID.
   */
  static async saveCard(customerId, card) {
    const { last_four_digits, expiration_date, card_owner, card_number } = card;
    const card_type = "VISA"; // Assuming card type is always VISA as per original code
    try {
      const [result] = await db.query(
        'CALL insert_card(?, ?, ?, ?, ?, ?)', 
        [customerId, last_four_digits, expiration_date, card_owner, card_type, card_number]
      );
      
      // Retrieve the inserted ID from the result set
      const insertId = result[0]?.insertId;
      return insertId;
    } catch (error) {
      console.error("Error in saveCard:", error);
      throw error;
    }
  }

  /**
   * Retrieves a card by customer ID using a stored procedure.
   * @param {number} customerId - The ID of the customer.
   * @returns {Promise<Object>} - A promise that resolves to the card object.
   */
  static async getCardByCustomerId(customerId) {
    try {
      const [rows] = await db.query('CALL get_card_by_customer_id(?)', [customerId]);

      // Stored procedures in MySQL return results in an array of result sets.
      // The actual data is usually in the first element.
      return rows[0][0];
    } catch (error) {
      console.error("Error in getCardByCustomerId:", error);
      throw error;
    }
  }
}

module.exports = Card;