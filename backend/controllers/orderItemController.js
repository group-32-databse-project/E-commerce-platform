const OrderItem = require("../models/OrderItem");

exports.getItemsByOrderId = async (req, res) => {
  try {
    const items = await OrderItem.getItemsByOrderId(req.params.orderId);
    res.json(items);
  } catch (error) {
    console.error("Error in getItemsByOrderId:", error);
    res
      .status(500)
      .json({ message: "Error fetching items", error: error.toString() });
  }
};
