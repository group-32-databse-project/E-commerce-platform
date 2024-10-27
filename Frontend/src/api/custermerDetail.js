import axios from "axios";

async function getCustomerDetail() {
  try {
    const customerId = localStorage.getItem("customerId");
    const response = await axios.get(`/api/customers/${customerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer detail:", error);
    throw error;
  }
}

export default getCustomerDetail;
