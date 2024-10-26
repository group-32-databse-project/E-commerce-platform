const express = require("express");
const customerController = require("../controllers/customerController.js");

const router = express.Router();

// POST /api/customers/register
router.post("/register", customerController.registerCustomer);

// GET /api/customers/:id
router.get("/:id", customerController.getCustomerById);

// POST /api/customers/login
router.post("/login", customerController.loginCustomer);

// GET /api/customers/:id/addresses
router.get("/:id/addresses", customerController.getAddressesByCustomerId);

// POST /api/customers/:id/payment
router.get("/:id/payment", customerController.getPaymentDeatails);

// Add more routes as needed (update, delete, etc.)

module.exports = router;