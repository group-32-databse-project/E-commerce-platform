const Customer = require('../models/Customer');
const PhoneNumber = require('../models/PhoneNumber');
const Address = require('../models/Address');
const ShoppingCart = require('../models/ShoppingCart');
const CustomerAddress = require("../models/CustomerAddress");
const OrderItem = require("../models/OrderItem");
const bcrypt = require("bcrypt");
const Order = require("../models/Order");

const jwt = require("jsonwebtoken");

exports.registerCustomer = async (req, res) => {
  try {
    const customerId = await Customer.createCustomer(req.body);
    // Create a shopping cart for the new customer
    const cartId = await ShoppingCart.createCart(customerId);
    res.status(201).json({ customerId, cartId });
  } catch (error) {
    console.error("Error in registerCustomer:", error);
    res
      .status(500)
      .json({ message: "Error registering customer", error: error.toString() });
  }
};

exports.getPaymentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.getCustomerById(id);
    if (customer) {
      const paymentDetails = await Customer.getPaymentDetailsByCustomerId(
        customer.customer_id
      );
      res.json(paymentDetails);
      console.log("Payment details:", paymentDetails);
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    console.error("Error in getPaymentDetails:", error);
    res.status(500).json({
      message: "Error fetching payment details",
      error: error.toString(),
    });
  }
};

exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.getCustomerByEmail(email);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { customerId: customer.customer_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.status(200).json({ message: "Login successful", customer, token });
    console.log("Login successful");
  } catch (error) {
    console.error("Error in loginCustomer:", error);
    res
      .status(500)
      .json({ message: "Error logging in customer", error: error.toString() });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const formData = req.body;

    const addressId = await Address.createAddress(formData);
    await CustomerAddress.createCustomerAddress(customerId, addressId);
    res.status(200).json({ message: "Address added" });
  } catch (error) {
    console.log(error);
    console.error("Error in addAddress:", error);
    res
      .status(500)
      .json({ message: "Error adding address", error: error.toString() });
  }
};

exports.getAddressesByCustomerId = async (req, res) => {
  try {
    const address = await Address.getAddressesByCustomerId(
      req.params.customerId
    );
    res.status(200).json(address[0]);
  } catch (error) {
    console.error("Error in getAddressesByCustomerId:", error);
    res
      .status(500)
      .json({ message: "Error fetching addresses", error: error.toString() });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.getCustomerById(req.params.id);
    if (customer) {
      // Fetch addresses
      customer.addresses = await Address.getAddressesByCustomerId(
        customer.customer_id
      );
      res.json(customer);
      console.log('Customer found:', customer);
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    console.error("Error in getCustomerById:", error);
    res
      .status(500)
      .json({ message: "Error fetching customer", error: error.toString() });
  }
};

exports.getOrdersByCustomerId = async (req, res) => {
  try {
    const orders = await Order.getOrdersByCustomerId(req.params.customerId);

    res.json(orders);
  } catch (error) {
    console.error("Error in getOrdersByCustomerId:", error);
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.toString() });
  }
};

exports.updateprofile = async (req, res) => {
  try {
    const { id } = req.params;
    const { phone_number, ...profileData } = req.body;
   
    const customer = await Customer.getCustomerById(id);
    if (customer) {
      const updatedCustomer = await Customer.updateCustomer(id, profileData.customerData);
      if (profileData.customerData.phone_number) {
        await PhoneNumber.save(profileData.customerData.phone_number, id);
      }
      res.json(updatedCustomer);
      console.log('Customer updated:', updatedCustomer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    console.error('Error in updateCustomer:', error);
    res.status(500).json({ message: 'Error updating customer', error: error.toString() });
  }
};

// Add more controller methods as needed (update, delete, etc.)



