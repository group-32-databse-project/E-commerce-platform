import axios from "axios";

export const getOrderItem = async (orderId) => {
  try {
    const response = await axios.get(`/api/orders/${orderId}/items`);
    console.log("done");
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching order items:", error);
    return null;
  }
};
