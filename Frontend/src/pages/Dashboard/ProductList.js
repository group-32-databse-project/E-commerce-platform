import React, { useState, useEffect } from "react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products"); // Update with your backend URL
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data); // Update state with fetched products
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts(); // Call the function to fetch products
  }, []); // Empty dependency array ensures it runs once when component mounts

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Products</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          padding: "20px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.product_id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "16px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s",
              ":hover": {
                transform: "translateY(-5px)",
              },
            }}
          >
            <img
              src={product.product_image}
              alt={product.product_name}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "4px",
                marginBottom: "12px",
              }}
            />
            <h2 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>
              {product.product_name}
            </h2>
            <p style={{ fontSize: "0.9rem", color: "#666", flexGrow: 1 }}>
              {product.description}
            </p>
            <p style={{ fontSize: "0.9rem", marginTop: "8px" }}>
              <strong>Weight:</strong> {product.weight} kg
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
