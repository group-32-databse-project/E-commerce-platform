import React, { useState, useEffect } from "react";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import '../../assets/styles/Newarrival.css'; // Import custom CSS

const NewArrival = () => {
  const [products, setProducts] = useState([]);

  // Fetch recent arrivals from backend
  useEffect(() => {
    const fetchRecentArrivals = async () => {
      try {
        const response = await axios.get('/api/products/new-arrivals');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching recent arrivals:', error);
      }
    };

    fetchRecentArrivals();
  }, []);

  return (
    <section className="new-arrivals-section py-3"> {/* Added py-3 for vertical padding */}
      <h4 className="text-center mb-0">New Arrivals</h4> {/* Changed margin class */}

      <div className="row justify-content-center">
        {products.map((product) => (
          <div key={product.variant_id} className="col-md-4 d-flex align-items-stretch mb-0"> {/* Added mb-3 for spacing between rows */}
            <div className="card shadow-sm hover-effect" style={{ width: "18rem" }}>
              <img
                src={product.variant_image}
                className="card-img-top"
                alt={product.product_name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.product_name}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrival;