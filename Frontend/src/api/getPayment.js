import axios from "axios";

export default async function getPayment() {
  try {
    console.log("getPayment");
    const customerId = localStorage.getItem("customerId");
    const response = await axios.get(`/api/payments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching payment:", error);
    throw error;
  }
}
