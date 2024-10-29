import axios from "axios";

export const saveCreditCard = async (data) => {
  try {
    console.log(data);
    const customerId = localStorage.getItem("customerId");
    const response = await axios.post(
      `/api/payments/card/save?customerId=${customerId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error saving credit card:", error);
    throw error;
  }
};
