import axios from "axios";

export const getOrder = async () => {
  try {
    const customerId = localStorage.getItem("customerId");
    const response = await axios.get(`/api/customers/${customerId}/orders`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
};
