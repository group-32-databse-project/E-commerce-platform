import axios from "axios";

export const makeOrder = async () => {
  try {
    const customerId = localStorage.getItem("customerId");
    const response = await axios.post("/api/orders", { customerId });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
