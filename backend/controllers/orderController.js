const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  const { user_id, delivery_module_id, payment_method_id, delivery_method, delivery_address_id, total_order_price, order_status, items } = req.body;

  try {
    const orderId = await Order.createOrder({
      user_id,
      delivery_module_id,
      payment_method_id,
      delivery_method,
      delivery_address_id,
      total_order_price,
      order_status,
      items
    });
    res.status(201).json({ orderId });
  } catch (error) {
    console.error('Error in createOrder:', error);
    res.status(500).json({ message: 'Error creating order', error: error.toString() });
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



// Add more controller methods as needed