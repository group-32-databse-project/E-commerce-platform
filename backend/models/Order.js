const db = require('../config/database');

class Order {
  static async createOrder(orderData) {
    const {
      user_id,
      delivery_module_id,
      payment_method_id,
      delivery_method,
      delivery_address_id,
      total_order_price,
      order_status
    } = orderData;

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [orderResult] = await connection.query(
        `INSERT INTO shop_order 
        (user_id, delivery_module_id, order_date, payment_method_id, delivery_method, delivery_address_id, total_order_price, order_status, updated_at)
        VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, NOW())`,
        [user_id, delivery_module_id, payment_method_id, delivery_method, delivery_address_id, total_order_price, order_status]
      );

      const orderId = orderResult.insertId;

      // Insert order items
      for (const item of orderData.items) {
        const { variant_id, quantity, price } = item;
        await connection.query(
          'INSERT INTO order_item (order_id, variant_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, variant_id, quantity, price]
        );

        // Update inventory
        await connection.query(
          'UPDATE variant SET inventory_stock = inventory_stock - ? WHERE variant_id = ?',
          [quantity, variant_id]
        );
      }

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getOrderById(orderId) {
    const [rows] = await db.query('SELECT * FROM shop_order WHERE order_id = ?', [orderId]);
    return rows[0];
  }

  static async getOrdersByCustomerId(customerId) {
   
    
    const [rows] = await db.query(
      `SELECT 
         *
       FROM shop_order 
       LEFT JOIN order_item ON shop_order.order_id = order_item.order_id 
       LEFT JOIN variant ON order_item.variant_id = variant.variant_id 
       LEFT JOIN product ON variant.product_id = product.product_id 
       WHERE shop_order.user_id = ?`, 
      [customerId]
    );
    console.log('rows:', rows);
  
    // Process the results to group items under their respective orders
   
    return rows;
  }
  

  // Add more methods as needed
}

module.exports = Order;