import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../assets/styles/Newarrival.css"; // Import custom CSS

const NewArrival = () => {
  const [products, setProducts] = useState([]);

  // Fetch recent arrivals from backend
  useEffect(() => {
    const fetchRecentArrivals = async () => {
      try {
        const response = await axios.get("/api/products/new-arrivals");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching recent arrivals:", error);
      }
    };

    fetchRecentArrivals();
  }, []);

  return (
    <div className="new-arrivals-container">
      <h2 className="new-arrivals-title">New Arrivals</h2>
      <div className="new-arrivals-grid">
        {products.map((product) => (
          <div key={product.variant_id} className="new-arrival-card">
            <img
              src={product.variant_image}
              alt={product.product_name}
              className="new-arrival-image"
            />
            <h3 className="new-arrival-name">{product.product_name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewArrival;