const express = require('express');
const router = express.Router();
const orderController = require("../controllers/orderController");
const orderItemController = require("../controllers/orderItemController.js");

// POST /api/orders
router.post("/", orderController.createOrder);

// GET /api/orders/:id
router.get('/:id', orderController.getOrderById);

router.get('/:id/customer', orderController.getOrdersByCustomerId);


///api/orders/${orderId}/items
router.get("/:orderId/items", orderItemController.getItemsByOrderId);

module.exports = router;
