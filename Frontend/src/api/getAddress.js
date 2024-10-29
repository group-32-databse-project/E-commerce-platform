import axios from "axios";

const getAddress = async () => {
  try {
    const customerId = localStorage.getItem("customerId");
    const response = await axios.get(`/api/customers/${customerId}/address`);
    if (!response.data || Object.keys(response.data).length === 0) {
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching address:", error);
    throw error;
  }
};

export default getAddress;