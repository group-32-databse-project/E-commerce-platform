import axios from "axios";
import calculateShipping from "./shipping";

const calculateTotal = (cartData, discount) => {
  const subtotal = calculateSubtotal(cartData);
  const shipping = calculateShipping();
  const tax = parseFloat(calculateTax());

  savePrice(cartData, subtotal + shipping + tax - discount);
  return (subtotal + shipping + tax - discount).toFixed(2);
};
const calculateSubtotal = (cartData) => {
  return (
    cartData?.items.reduce(
      (total, item) => total + parseFloat(item.total_price * item.quantity),
      0
    ) || 0
  );
};
// Calculate tax (example logic)
const calculateTax = () => {
  return (calculateSubtotal() * 0.08).toFixed(2); // 8% tax
};
const savePrice = (cartData, price) => {
  axios.patch(`/api/cart/${cartData.customer_id}/savePrice`, { price });
};

export { calculateTotal, calculateSubtotal, calculateTax };
