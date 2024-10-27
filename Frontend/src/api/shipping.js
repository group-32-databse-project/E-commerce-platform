const calculateShipping = (subtotal) => {
  if (subtotal > 50) {
    return 0;
  }
  return 15;
};

export default calculateShipping;
