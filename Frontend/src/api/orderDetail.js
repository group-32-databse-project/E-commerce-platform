import axios from "axios";

async function getOrderDetail(orderId) {
  try {
    console.log("orderId", orderId);
    const customerId = localStorage.getItem("customerId");
    const response = await axios.get(`/api/orders/${orderId}`, {
      data: {
        customer_id: customerId,
      },
    });
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching order detail:", error);
    throw error;
  }
}

export default getOrderDetail;
