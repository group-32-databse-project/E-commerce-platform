import axios from "axios";

export const makeOrder = async () => {
  try {
    const customerId = localStorage.getItem("customerId");
    const response = await axios.post(`/api/orders?customer_id=${customerId}`);
    console.log("Order created successfully:", response.data);
    console.log("Order ID:", response.data.orderId);

    return response.data.orderId;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
