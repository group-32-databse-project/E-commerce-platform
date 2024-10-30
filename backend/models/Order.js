const db = require('../config/database');

class Order {
  
  /**
   * Creates a new order using a stored procedure.
   * @param {number} customer_id 
   * @param {number} delivery_module_id 
   * @param {number} payment_method_id 
   * @param {string} delivery_method 
   * @param {number} delivery_address_id 
   * @param {number} total_order_price 
   * @param {number} subtotal 
   * @param {number} shipping 
   * @param {number} tax 
   * @param {Date} shipping_date 
   * @param {string} order_status 
   * @param {number} discount 
   * @returns {Promise<number>} - The ID of the newly created order.
   */
  static async createOrder(
    customer_id,
    delivery_module_id,
    payment_method_id,
    delivery_method,
    delivery_address_id,
    total_order_price,
    subtotal,
    shipping,
    tax,
    shipping_date,
    order_status,
    discount
  ) {
    try {
      const [rows] = await db.query('CALL create_order(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @order_id); SELECT @order_id;', [
        customer_id,
        delivery_module_id,
        payment_method_id,
        delivery_method,
        delivery_address_id,
        total_order_price,
        subtotal,
        shipping,
        tax,
        shipping_date,
        order_status,
        discount
      ]);
      
      // The second result set contains the OUT parameter
      const orderId = rows[1][0]['@order_id'];
      return orderId;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Retrieves an order by its ID using a stored procedure.
   * @param {number} orderId 
   * @returns {Promise<Object>} - The order object.
   */
  static async getOrderById(orderId) {
    try {
      const [rows] = await db.query('CALL get_order_by_id(?);', [orderId]);
      // The result of a CALL is nested within an array
      return rows[0][0];
    } catch (error) {
      console.error(`Error fetching order with ID ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Retrieves all orders for a specific customer using a stored procedure.
   * @param {number} customerId 
   * @returns {Promise<Array>} - An array of orders.
   */
  static async getOrdersByCustomerId(customerId) {
    try {
      const [rows] = await db.query('CALL get_orders_by_customer_id(?);', [customerId]);
      // The result of a CALL is nested within an array
      return rows[0];
    } catch (error) {
      console.error(`Error fetching orders for customer ID ${customerId}:`, error);
      throw error;
    }
  }

  // Add more methods as needed with similar logging and stored procedure calls
}

module.exports = Order;