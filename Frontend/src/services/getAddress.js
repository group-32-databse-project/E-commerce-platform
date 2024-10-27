import axios from "axios";

export const getAddress = async () => {
  try {
    const customerId = localStorage.getItem("customerId");
    const response = await axios.get(`/api/customers/${customerId}/address`);
    console.log(response.data); // This line logs the response data
    if (response.data.length > 0) {
      return response.data[0]; // Return the first address object directly
    }
    return null; // Handle the case where there are no addresses
  } catch (error) {
    console.error("Error fetching address:", error);
    return null;
  }
};
