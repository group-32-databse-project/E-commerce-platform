const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authenticate = require('../middlewares/authenticate');

// Apply the authentication middleware to all routes in this router
router.use(authenticate);

// Add item to wishlist
router.post('/', wishlistController.addToWishlist);

// Remove item from wishlist
router.delete('/', wishlistController.removeFromWishlist);

// Get all wishlist items for the authenticated customer
router.get('/', wishlistController.getWishlist);

module.exports = router;
