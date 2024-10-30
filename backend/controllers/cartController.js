const ShoppingCart = require("../models/ShoppingCart");
const ShoppingCartItem = require("../models/ShoppingCartItem");

exports.getCart = async (req, res) => {
  console.log("come");
  console.log(req.params);
  const { customerId } = req.params;
  try {
    const cart = await ShoppingCart.getCartByCustomerId(customerId);

    if (cart) {
      const items = await ShoppingCartItem.getItemsByCartId(
        cart.shopping_cart_id
      );
      cart.items = items;
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error("Error in getCart:", error);
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.toString() });
  }
};

exports.changeQuantity = async (req, res) => {
  const { customerId } = req.params;
  const { variant_id, change } = req.body;
  try {
    const cart = await ShoppingCart.getCartByCustomerId(customerId);
    if (cart) {
      await ShoppingCartItem.changeQuantity(
        cart.shopping_cart_id,
        variant_id,
        change
      );
      await ShoppingCart.updateCart(cart.shopping_cart_id);
      res.status(200).json({ message: "Quantity changed" });
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error("Error in changeQuantity:", error);
    res
      .status(500)
      .json({ message: "Error changing quantity", error: error.toString() });
  }
};

exports.addItemToCart = async (req, res) => {
  const { customerId } = req.params;
  const { variant_id, quantity } = req.body;

  try {
    const cart = await ShoppingCart.getCartByCustomerId(customerId);
    if (cart) {
      await ShoppingCartItem.addItem(
        cart.shopping_cart_id,
        variant_id,
        quantity
      );
      await ShoppingCart.updateCart(cart.shopping_cart_id);
      res.status(200).json({ message: "Item added to cart" });
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error("Error in addItemToCart:", error);
    res
      .status(500)
      .json({ message: "Error adding item to cart", error: error.toString() });
  }
};

exports.removeItemFromCart = async (req, res) => {
  const { shoppingCartItemId } = req.body;
  console.log(shoppingCartItemId);
  try {
    await ShoppingCartItem.removeItem(shoppingCartItemId);
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error in removeItemFromCart:", error);
    res.status(500).json({
      message: "Error removing item from cart",
      error: error.toString(),
    });
  }
};

exports.clearCart = async (req, res) => {
  const { customerId } = req.params;
  try {
    const cart = await ShoppingCart.getCartByCustomerId(customerId);
    if (cart) {
      await ShoppingCartItem.clearCart(cart.shopping_cart_id);
      res.status(200).json({ message: "Cart cleared" });
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error("Error in clearCart:", error);
    res
      .status(500)
      .json({ message: "Error clearing cart", error: error.toString() });
  }
};

exports.saveForLater = async (req, res) => {
  const { customerId } = req.params;
  const itemId = req.body.shopping_cart_item_id;
  try {
    const cart = await ShoppingCart.getCartByCustomerId(customerId);
    await ShoppingCartItem.saveForLater(itemId, cart.shopping_cart_id);
    res.status(200).json({ message: "Item saved for later" });
  } catch (error) {
    console.error("Error in saveForLater:", error);
    res.status(500).json({
      message: "Error saving item for later",
      error: error.toString(),
    });
  }
};

exports.savePrice = async (req, res) => {
  const { customerId } = req.params;
  const { price, subtotal, shipping, tax, discount } = req.body;
  try {
    const cart = await ShoppingCart.getCartByCustomerId(customerId);
    await ShoppingCart.savePrice(
      cart.shopping_cart_id,
      price,
      subtotal,
      shipping,
      tax,
      discount
    );
    res.status(200).json({ message: "Price saved" });
  } catch (error) {
    console.error("Error in savePrice:", error);
    res
      .status(500)
      .json({ message: "Error saving price", error: error.toString() });
  }
};

exports.unsaveItem = async (req, res) => {
  const { customerId } = req.params;
  const itemId = req.body.shopping_cart_item_id;
  try {
    const cart = await ShoppingCart.getCartByCustomerId(customerId);
    await ShoppingCartItem.unsaveItem(itemId, cart.shopping_cart_id);
    res.status(200).json({ message: "Item unsaved" });
  } catch (error) {
    console.error("Error in unsaveItem:", error);
    res.status(500).json({
      message: "Error unsaving item",
      error: error.toString(),
    });
  }
};
