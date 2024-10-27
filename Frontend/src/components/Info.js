import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import {
  calculateTotal,
  calculateTax,
  calculateSubtotal,
} from "../api/calculateTotal";
import calculateShipping from "../api/shipping";
import { Card, CardContent, Paper, Box, Stack, Divider } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

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

  const totalPrice = calculateTotal(cartData, 0);
  const subtotal = calculateSubtotal(cartData);
  return (
    <Card elevation={2} sx={{ maxWidth: 400, width: "100%" }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}>
          <ShoppingCartIcon color="primary" />
          <Typography variant="h6" component="h2">
            Order Summary
          </Typography>
        </Box>

        {/* Items List */}
        <Paper
          sx={{
            maxHeight: 280,
            overflow: "auto",
            mb: 3,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: "4px",
            },
          }}
        >
          <List disablePadding>
            {cartData.items.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem sx={{ py: 1.5, px: 2 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {item.product_name}
                      </Typography>
                    }
                    secondary={`Quantity: ${item.quantity}`}
                    sx={{ mr: 2 }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    ${(item.total_price * item.quantity).toFixed(2)}
                  </Typography>
                </ListItem>
                {index < cartData.items.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>

        {/* Summary Section */}
        <Stack spacing={2}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Subtotal
            </Typography>
            <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Shipping
            </Typography>
            <Typography variant="body2">${calculateShipping()}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Tax
            </Typography>
            <Typography variant="body2">${calculateTax()}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Discount
            </Typography>
            <Typography variant="body2" sx={{ color: "success.main" }}>
              -$0.00
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6" color="primary">
              ${totalPrice}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default Info;


