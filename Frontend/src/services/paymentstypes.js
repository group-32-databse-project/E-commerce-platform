// fetchPaymentData function using Axios
import axios from "axios";

export async function fetchPaymentData() {
  try {
    const response = await axios.get("/api/payments", {
      headers: {
        "Content-Type": "application/json",
        // Include authorization headers if required
        // 'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("fetchPaymentData:", error);
    // Handle errors appropriately in your application
    throw error;
  }
}
