import axios from "axios";

export default function saveAddress(formData) {
  axios.post(`/api/cart/${localStorage.getItem("customer_id")}/saveAddress`, {
    formData,
  });
}
