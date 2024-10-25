import axios from "axios";

const changeQuantity = async (cartItem, operation) => {
  try {
    const customerId = localStorage.getItem("customerId");
    if (!customerId) {
      throw new Error("Customer ID not found in localStorage");
    }

    console.log(
      `Sending request to ${operation} item quantity in cart:`,
      cartItem
    );
    console.log("Customer ID:", customerId);

    const url = `/api/cart/${customerId}/changequantity`;
    console.log("Request URL:", url);

    const response = await axios.patch(
      url,
      { ...cartItem, operation },
      {
        timeout: 10000, // 10 seconds timeout
        headers: {
          "Content-Type": "application/json",
          // Add any other headers your API might require
        },
      }
    );

    console.log("Response from server:", response);

    if (response.status === 200) {
      console.log(`Item quantity ${operation}ed successfully`);
      return response.data; // Return updated cart data
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error ${operation}ing item quantity:`, error);
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
