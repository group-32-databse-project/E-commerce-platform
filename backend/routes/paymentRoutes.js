const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// GET /api/payments
router.get("/", paymentController.getAllPaymentMethods);

// GET /api/payments/card/save
router.post("/card/save", paymentController.saveCard);
// Add more routes as needed

module.exports = router;
