const Order = require('../models/Order');
const Cart = require("../models/Cart");
const Address = require("../models/Address");

exports.createOrder = async (req, res) => {
  const customer_id = req.query.customer_id;
  const cart = await Cart.getCartIdByCustomerId(customer_id);
  const delivery_module_id = 1;
  const payment_method_id = 1;
  const delivery_method = "standard";
  const delivery_address = await Address.getAddressesByCustomerId(customer_id);

  const delivery_address_id = delivery_address[0].address_id;

  const total_order_price = cart.total_price;
  const subtotal = 0;
  const shipping = 0;
  const tax = 0;
  const order_status = "pending";
  const orderId = await Order.createOrder(
    customer_id,
    delivery_module_id,
    payment_method_id,
    delivery_method,
    delivery_address_id,

    total_order_price,
    subtotal,
    shipping,
    tax,
    order_status
  );

  console.log("orderId", orderId);
  try {
    res.status(201).json({ orderId });
  } catch (error) {
    console.error("Error in createOrder:", error);
    res
      .status(500)
      .json({ message: "Error creating order", error: error.toString() });
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
exports.getOrdersById = async (req, res) => {
  try {
    const orders = await Order.getOrderById(req.params.id);

    res.json(orders);
  } catch (error) {
    console.error("Error in getOrdersByCustomerId:", error);
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.toString() });
  }
};  



// Add more controller methods as needed