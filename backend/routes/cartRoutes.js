const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// GET /api/cart/:customerId
router.get('/:customerId', cartController.getCart);

// POST /api/cart/:customerId/add
router.post('/:customerId/add', cartController.addItemToCart);

// Patch /api/cart/:customerId/changeQuantity
router.patch('/:customerId/changeQuantity', cartController.changeQuantity);

// DELETEx
router.delete('/:customerId/remove', cartController.removeItemFromCart);

// DELETE /api/cart/item/:shoppingCartItemId
router.delete('/item/:shoppingCartItemId', cartController.removeItemFromCart);

// POST /api/cart/:customerId/clear
router.post('/:customerId/clear', cartController.clearCart);

//patch /api/cart/:customerId/saveItem
router.patch('/:customerId/saveItem', cartController.saveForLater);

//patch /api/cart/:customerId/unsaveItem
router.patch('/:customerId/unsaveItem', cartController.unsaveItem);

//patch /api/cart/:customerId/savePrice
router.patch('/:customerId/savePrice', cartController.savePrice);



module.exports = router;
