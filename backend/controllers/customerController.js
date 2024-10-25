const Customer = require('../models/Customer');
const Address = require('../models/Address');
const ShoppingCart = require('../models/ShoppingCart');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

exports.registerCustomer = async (req, res) => {
  try {
    const customerId = await Customer.createCustomer(req.body);
    // Create a shopping cart for the new customer
    const cartId = await ShoppingCart.createCart(customerId);
    res.status(201).json({ customerId, cartId });
  } catch (error) {
    console.error('Error in registerCustomer:', error);
    res.status(500).json({ message: 'Error registering customer', error: error.toString() });
  }
};

exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.getCustomerByEmail(email);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ customerId: customer.customer_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: true });
    res.status(200).json({ message: 'Login successful', customer, token });
    console.log('Login successful');
  } catch (error) {
    console.error('Error in loginCustomer:', error);
    res.status(500).json({ message: 'Error logging in customer', error: error.toString() });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const { customerId, formData } = req.body;
    const addressId = await Address.getAddressIdbyCustomerId(customerId);
    await Address.createAddress(customerId, formData);
    res.status(200).json({ message: "Address added" });
  } catch (error) {
    console.error("Error in addAddress:", error);
    res
      .status(500)
      .json({ message: "Error adding address", error: error.toString() });
  }
};


exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.getCustomerById(req.params.id);
    if (customer) {
      // Fetch addresses
      customer.addresses = await Address.getAddressesByCustomerId(customer.customer_id);
      res.json(customer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    console.error('Error in getCustomerById:', error);
    res.status(500).json({ message: 'Error fetching customer', error: error.toString() });
  }
};

// Add more controller methods as needed (update, delete, etc.)
