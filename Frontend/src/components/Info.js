import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

function Info() {
  const [cartData, setCartData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch cart data function
  const fetchCartData = async () => {
    setLoading(true);
    try {
      const customerId = localStorage.getItem("customerId");
      const token = localStorage.getItem("token");

      if (!customerId || !token) {
        throw new Error("Customer ID or token not found. Please log in.");
      }

      const response = await fetch(`/api/cart/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Fetched cart data:", data);
      setCartData(data);
    } catch (err) {
      console.error("Error fetching cart data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!cartData) {
    return <Typography>No items in cart</Typography>;
  }

  const totalPrice = cartData.items
    .map((item) => item.total_price * item.quantity)
    .reduce((acc, curr) => acc + curr, 0);

  return (
    <React.Fragment>
      <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
        Total
      </Typography>
      <Typography variant="h4" gutterBottom>
        {totalPrice}
      </Typography>
      <List disablePadding>
        {cartData.items.map((item) => (
          <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
            <ListItemText
              sx={{ mr: 2 }}
              primary={item.product_name}
              secondary={`Quantity: ${item.quantity}`}
            />
            <Typography variant="body1" sx={{ fontWeight: "medium" }}>
              ${(item.total_price * item.quantity).toFixed(2)}
            </Typography>
          </ListItem>
        ))}
      </List>
    </React.Fragment>
  );
}

export default Info;
