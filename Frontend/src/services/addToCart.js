import axios from "axios";

const addToCart = async (cartItem) => {
  try {
    const customerId = localStorage.getItem("customerId");
    if (!customerId) {
      console.error("Customer ID not found in localStorage");
      return;
    }

    console.log("Sending request to add item to cart:", cartItem);
    console.log("Customer ID:", customerId);

    const url = `/api/cart/${customerId}/add`;
    console.log("Request URL:", url);

    const response = await axios.post(url, cartItem, {
      timeout: 10000, // 10 seconds timeout
      headers: {
        "Content-Type": "application/json",
        // Add any other headers your API might require
      },
    });

    console.log("Response from server:", response);

    if (response.status === 200) {
      console.log("Item added to cart successfully");
      // Navigate to cart page after successful addition
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
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
    alert(error.message);
  }
};

export default addToCart;
