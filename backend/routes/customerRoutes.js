const express = require("express");
const customerController = require("../controllers/customerController.js");

const router = express.Router();

// POST /api/customers/register
router.post("/register", customerController.registerCustomer);

//post /api/customers/addAddress
router.post("/addAddress", customerController.addAddress);

// GET /api/customers/:id
router.get("/:id", customerController.getCustomerById);

// POST /api/customers/login
router.post("/login", customerController.loginCustomer);

// Add more routes as needed (update, delete, etc.)

module.exports = router;
