const db = require("../config/database");

class Card {
  static async saveCard(customerId, card) {
    const { last_four_digits, expiration_date, card_owner, card_number } = card;
    try {
      await db.query(
        "INSERT INTO cards (customer_id, last_four_digits, expiration_date, card_owner,card_type,card_number) VALUES (?, ?, ?, ?, ?, ?)",
        [
          customerId,
          last_four_digits,
          expiration_date,
          card_owner,
          "VISA",
          card_number,
        ]
      );
      return true;
    } catch (error) {
      console.error("Error in saveCard:", error);
      throw error;
    }
  }
}

module.exports = Card;
