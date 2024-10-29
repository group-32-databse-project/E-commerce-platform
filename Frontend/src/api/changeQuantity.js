import axios from "axios";

const changeQuantity = async (itemId, change) => {
  try {
    const customerId = localStorage.getItem("customerId");
    if (!customerId) {
      throw new Error("Customer ID not found in localStorage");
    }

    const response = await axios.patch(
      `/api/cart/${customerId}/changequantity`,
      { variant_id: itemId, change: change }
    );
    return response.data;
  } catch (error) {
    console.error(`Error item quantity:`, error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", error.message);
    }
    throw error; // Re-throw the error to be handled by the caller
  }
};

export default changeQuantity;
