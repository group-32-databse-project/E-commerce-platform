const WishlistItem = require('../models/WishlistItem');

exports.addToWishlist = async (req, res) => {
  const customerId = req.customer.id;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const existing = await WishlistItem.isItemInWishlist(customerId, productId);
    if (existing) {
      return res.status(400).json({ message: "Item already in wishlist" });
    }

    const wishlistItemId = await WishlistItem.addItem(customerId, productId);
    res.status(201).json({ message: "Item added to wishlist", wishlistItemId });
  } catch (error) {
    console.error("Error in addToWishlist:", error);
    res
      .status(500)
      .json({
        message: "Error adding item to wishlist",
        error: error.toString(),
      });
  }
};

exports.removeFromWishlist = async (req, res) => {
  const customerId = req.customer.id;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const affectedRows = await WishlistItem.removeItem(customerId, productId);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }
    res.status(200).json({ message: "Item removed from wishlist" });
  } catch (error) {
    console.error("Error in removeFromWishlist:", error);
    res
      .status(500)
      .json({
        message: "Error removing item from wishlist",
        error: error.toString(),
      });
  }
};

exports.getWishlist = async (req, res) => {
  const customerId = req.customer.id;

  try {
    const wishlist = await WishlistItem.getWishlist(customerId);
    res.status(200).json(wishlist);
  } catch (error) {
    console.error('Error in getWishlist:', error);
    res.status(500).json({ message: 'Error fetching wishlist', error: error.toString() });
  }
};
