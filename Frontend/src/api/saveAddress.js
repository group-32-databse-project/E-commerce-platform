import axios from "axios";

export default async function saveAddress(formData) {
  const customerId = localStorage.getItem("customerId");

  try {
    const response = await axios.post(
      `/api/customers/${customerId}/addAddress`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error saving address:", error);
    throw error;
  }
}
