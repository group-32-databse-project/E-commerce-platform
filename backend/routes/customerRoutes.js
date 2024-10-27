const express = require("express");
const customerController = require("../controllers/customerController.js");

const router = express.Router();

// POST /api/customers/register
router.post("/register", customerController.registerCustomer);

//post /api/customers/addAddress
router.post("/addAddress", customerController.addAddress);


//Get 


router.get("/:customerId/address", customerController.getAddressesByCustomerId);


//Get /api/customers/:customerId/orders
router.get("/:customerId/orders", customerController.getOrdersByCustomerId);


// GET /api/customers/:id
router.get("/:id", customerController.getCustomerById);

// Get  /api/customers/${customerId}/addAddress
router.post("/:customerId/addAddress", customerController.addAddress);

// POST /api/customers/login
router.post("/login", customerController.loginCustomer);

// Add more routes as needed (update, delete, etc.)

module.exports = router;
