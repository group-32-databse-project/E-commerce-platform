import React, { useEffect, useState } from "react";
import "./allcategory.css";

const AllCategory = () => {
    const [products, setProducts] = useState([]);
    const [cartProductId, setCartProductId] = useState(null); // State for the cart product ID
    const [cartProducts, setCartProducts] = useState(); // State for cart products
    const [error, setError] = useState('');

    const onAddToCart = async (productId) => {
        try {
            // Send the product ID to the backend
            const response = await fetch("http://localhost:5000/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: productId }), // Send the product ID directly
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('Cart item fetched:', data); // Debug: check the fetched cart item
        } catch (error) {
            console.error('Error adding to cart:', error);
            setError(error.message); // Update the error state
        }
    };
    
    

    // Fetch products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/products");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data);
                console.log("Products fetched:", data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <section className="products-section mb-4">
            <h1>Our Products</h1>
            <div className="row">
                {products.map((product, index) => (
                    <div
                        className="col-md-3"
                        key={index}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "16px",
                            margin: "8px",
                            width: "250px",
                            backgroundColor: "#f9f9f9",
                            textAlign: "center",
                            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <img
                            src={product.image}
                            alt={product.product_name}
                            style={{ width: "100px", height: "100px" }}
                        />
                        <h2>{product.product_name}</h2>
                        <div style={{ marginTop: "8px", fontSize: "14px" }}>
                            <p><strong>Description:</strong> {product.description}</p>
                            <p><strong>Price:</strong> {product.total_price} $</p>
                            <p><strong>Weight:</strong> {product.weight}</p>
                        </div>
                        
                        <button 
                            className="btn btn-primary" 
                            onClick={() => onAddToCart(product.variant_id)} // Call onAddToCart with the product ID
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>      
            {error && <div className="error">{error}</div>} {/* Display error if exists */}
        </section>
    );
};

export default AllCategory;
