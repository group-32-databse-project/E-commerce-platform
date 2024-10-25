const db = require("../config/database");

class CustomerAddress {
  static async createCustomerAddress(customerId, addressId) {
    await db.query(
      "INSERT INTO customer_address (customer_id, address_id) VALUES (?, ?)",
      [customerId, addressId]
    );
  }
}

module.exports = CustomerAddress;
