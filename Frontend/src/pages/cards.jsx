import React, { useState, useEffect } from "react"; // Move all imports to the top
import CardGrid from "../components/card";
import Header from "../components/header";

var num = 0;

const Card = () => {
  const [cartItems, setCartItems] = useState([]); // State for cart items

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch("/api/cart"); // Replace with your backend API URL
        const data = await response.json();
        setCartItems(data);
        console.log("Products fetched succesfully:", data);
      } catch (error) {
        console.error("Error fetching cartItems:", error);
      }
    };

    fetchCartItems();
  }, []);
  console.log(cartItems);
  return (
    <>
      <Header />

      {/* Pass fetched products (stored in 'products') to CardGrid */}
      <CardGrid cards={cartItems} />
    </>
  );
};

export default Card;

export const CardsCount = () => {
  return num;
};
