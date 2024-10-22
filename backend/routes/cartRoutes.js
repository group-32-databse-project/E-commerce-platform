const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// GET /api/cart/:customerId
router.get('/:customerId', cartController.getCart);

// POST /api/cart/:customerId/add
router.post('/:customerId/add', cartController.addItemToCart);

// DELETE /api/cart/:customerId/remove
router.delete('/:customerId/remove', cartController.removeItemFromCart);

// DELETE /api/cart/item/:shoppingCartItemId
router.delete('/item/:shoppingCartItemId', cartController.removeItemFromCart);

// POST /api/cart/:customerId/clear
router.post('/:customerId/clear', cartController.clearCart);

module.exports = router;