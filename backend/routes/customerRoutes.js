const express = require("express");
const customerController = require("../controllers/customerController.js");
const PhoneNumber = require("../controllers/phoneNumberController.js");

const router = express.Router();

// POST /api/customers/register
router.post("/register", customerController.registerCustomer);

//post /api/customers/addAddress
router.post("/addAddress", customerController.addAddress);

// GET /api/customers/:id
router.get("/:id", customerController.getCustomerById);

// Get  /api/customers/${customerId}/addAddress
router.post("/:customerId/addAddress", customerController.addAddress);

// POST /api/customers/login
router.post("/login", customerController.loginCustomer);

// GET /api/customers/:id/addresses
router.get("/:id/addresses", customerController.getAddressesByCustomerId);

// POST /api/customers/:id/payment
router.get("/:id/payment", customerController.getPaymentDeatails);

// POST /api/customers/:id/phonenumber
router.post("/:id/phonenumber", PhoneNumber.savePhoneNumber);

// Add more routes as needed (update, delete, etc.)

module.exports = router;