const Payment = require("../models/PaymentMethod");
const Card = require("../models/card");
exports.getAllPaymentMethods = async (req, res) => {
  try {
    const payments = await Payment.getPayments();
    res.json(payments).status(200);
  } catch (error) {
    console.error("Error in getPayment:", error);
    res
      .status(500)
      .json({ message: "Error fetching payments", error: error.toString() });
  }
};
exports.saveCard = async (req, res) => {
  const customerId = req.query.customerId || req.body.customerId;
  const card = req.body;
  console.log(customerId, card);
  try {
    await Card.saveCard(customerId, card);
    res.status(200).json({ message: "Card saved" });
  } catch (error) {
    console.error("Error in saveCard:", error);
    res
      .status(500)
      .json({ message: "Error saving card", error: error.toString() });
  }
};

exports.getCardsByCustomerId = async (req, res) => {
  try {
    const customerId = req.params.id;
    const cards = await Card.getCardByCustomerId(customerId);
    res.status(200).json(cards);
  } catch (error) {
    console.error("Error in getCardsByCustomerId:", error);
    res
      .status(500)
      .json({ message: "Error fetching cards", error: error.toString() });
  }
};
