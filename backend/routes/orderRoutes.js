const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');

// POST /api/orders/create
router.post('/create', OrderController.createOrder);

// GET /api/orders/:id
router.get('/:id', OrderController.getOrderById);

router.get('/:id/customer', OrderController.getOrdersByCustomerId);


// Add more order-related routes as needed

module.exports = router;
