import axios from "axios";
import calculateShipping from "./shipping";

const calculateTotal = (cartData, discount) => {
  const subtotal = calculateSubtotal(cartData);
  const shipping = calculateShipping(subtotal);
  const tax = parseFloat(calculateTax(cartData));
  const price = subtotal + shipping + tax - discount;
  savePrice(cartData, price, subtotal, shipping, tax, discount);
  return price.toFixed(2);
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
const calculateTax = (cartData) => {
  return (calculateSubtotal(cartData) * 0.08).toFixed(2); // 8% tax
};
const savePrice = (cartData, price, subtotal, shipping, tax, discount) => {
  axios.patch(`/api/cart/${cartData.customer_id}/savePrice`, {
    price,
    subtotal,
    shipping,
    tax,
    discount,
  });
};

export { calculateTotal, calculateSubtotal, calculateTax };
