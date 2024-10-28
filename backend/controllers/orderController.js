const Order = require('../models/Order');
const pool = require('../config/database'); // Ensure you have a database pool set up
const { executeQuery } = require('../utils/db'); // Your database utility module

exports.createOrder = async (req, res) => {
  const { user_id, delivery_module_id, payment_method_id, delivery_method, delivery_address_id, total_order_price, order_status, items } = req.body;

  // Basic validation (optional but recommended)
  if (!user_id || !delivery_module_id || !payment_method_id || !delivery_method || !delivery_address_id || !total_order_price || !order_status || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Invalid order data' });
  }

  // Get a connection from the pool
  const connection = await pool.getConnection();

  try {
    // Start a transaction
    await connection.beginTransaction();

    // 1. Insert into shop_order table
    const insertOrderQuery = `
      INSERT INTO shop_order 
        (user_id, delivery_module_id, order_date, payment_method_id, delivery_method, delivery_address_id, total_order_price, order_status)
      VALUES 
        (?, ?, NOW(), ?, ?, ?, ?, ?)
    `;
    const [orderResult] = await connection.execute(insertOrderQuery, [
      user_id,
      delivery_module_id,
      payment_method_id,
      delivery_method,
      delivery_address_id,
      total_order_price,
      order_status
    ]);

    const orderId = orderResult.insertId;

    // 2. Insert into order_item table
    const insertOrderItemQuery = `
      INSERT INTO order_item (order_id, variant_id, quantity, price)
      VALUES (?, ?, ?, ?)
    `;

    for (const item of items) {
      const { variant_id, quantity, price } = item;
      if (!variant_id || !quantity || !price) {
        throw new Error('Invalid order item data');
      }
      await connection.execute(insertOrderItemQuery, [
        orderId,
        variant_id,
        quantity,
        price
      ]);
    }

    // 3. Insert into notifications table
    const message = `Your order #${orderId} has been placed successfully.`;
    const insertNotificationQuery = `
      INSERT INTO notifications (user_id, order_id, message)
      VALUES (?, ?, ?)
    `;
    const [notificationResult] = await connection.execute(insertNotificationQuery, [
      user_id,
      orderId,
      message
    ]);

    // 4. Commit the transaction
    await connection.commit();

    // 5. Emit real-time notification via Socket.io (if implemented)
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${user_id}`).emit('new_notification', {
        id: notificationResult.insertId,
        user_id: user_id,
        order_id: orderId,
        message: message,
        is_read: false,
        created_at: new Date()
      });
    }

    // 6. Respond with success
    res.status(201).json({ orderId, message: 'Order created successfully' });

  } catch (error) {
    // Rollback the transaction in case of error
    await connection.rollback();
    console.error('Error in createOrder:', error);
    res.status(500).json({ message: 'Error creating order', error: error.toString() });
  } finally {
    // Release the database connection
    connection.release();
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.getOrderById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error in getOrderById:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
};

exports.getOrdersByCustomerId = async (req, res) => {
    try {
        const customerId = req.params.id;
        console.log('Fetching orders for customerId:', customerId);
        console.log('Fetching orders for customerId:', customerId);
        const orders = await Order.getOrdersByCustomerId(customerId);
        if (orders.length > 0) {
            res.json(orders);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
    
        console.error('Error in getOrdersByCustomerId:', error);
        res.status(500).json({ message: error.message });
    }
};

// Add more controller methods as needed