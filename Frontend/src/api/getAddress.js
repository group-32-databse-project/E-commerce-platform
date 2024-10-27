import axios from "axios";

async function getAddress() {
  try {
    const customerId = localStorage.getItem("customerId");
    const response = await axios.get(`/api/customers/${customerId}/address`);
    console.log("response.data", response.data);
    if (!response.data || Object.keys(response.data).length === 0) {
      return null; // or you could return a default value or an empty object {}
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching address:", error);
    throw error;
  }
}

export default getAddress;
