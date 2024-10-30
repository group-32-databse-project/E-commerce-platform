const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// GET /api/payments
router.get("/", paymentController.getAllPaymentMethods);

// GET /api/payments/card/save
router.post("/card/save", paymentController.saveCard);
// Add more routes as needed


//api/payments/card/${customerId}
//api/payments/card/11
router.get("/card/:id", paymentController.getCardsByCustomerId);

module.exports = router;


