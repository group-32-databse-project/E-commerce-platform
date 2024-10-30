const express = require('express');
const router = express.Router();
const orderController = require("../controllers/orderController");
const orderItemController = require("../controllers/orderItemController.js");

// POST /api/orders
router.post("/", orderController.createOrder);

// GET /api/orders/:id
router.get('/:id', OrderController.getOrderById);

router.get('/:id/customer', OrderController.getOrdersByCustomerId);


///api/orders/${orderId}/items
router.get("/:orderId/items", orderItemController.getItemsByOrderId);

module.exports = router;
