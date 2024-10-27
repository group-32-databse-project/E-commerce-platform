import axios from "axios";

async function getOrderDetail() {
  try {
    const orderId = localStorage.getItem("orderId");
    const response = await axios.get(`/api/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order detail:", error);
    throw error;
  }
}

export default getOrderDetail;
