import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Container,
  Divider,
  useTheme,
  useMediaQuery,
  Fade,
  Snackbar,
  Alert,
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  DeleteOutline as DeleteOutlineIcon,
  ShoppingCart as ShoppingCartIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { motion } from "framer-motion";

const Cart = () => {
  const [cartData, setCartData] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Retrieve customerId from localStorage when component mounts
  useEffect(() => {
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
        setSnackbar({
          open: true,
          message: err.message,
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  // Handle quantity changes
  const handleQuantityChange = async (itemId, change) => {
    if (!cartData) return;

    const updatedItems = cartData.items.map((item) => {
      if (item.shopping_cart_item_id === itemId) {
        const newQuantity = Math.max(1, item.quantity + change);
        return {
          ...item,
          quantity: newQuantity,
          total_price: (
            newQuantity *
            (parseFloat(item.total_price) / item.quantity)
          ).toFixed(2),
        };
      }
      return item;
    });

    setCartData({ ...cartData, items: updatedItems });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/cart/${cartData.customer_id}/remove`, {
        method: "PATCH", // Assuming PATCH is used for updating quantity
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopping_cart_item_id: itemId,
          quantity: updatedItems.find(
            (item) => item.shopping_cart_item_id === itemId
          ).quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update item quantity.");
      }

      setSnackbar({
        open: true,
        message: "Quantity updated.",
        severity: "success",
      });
    } catch (err) {
      console.error("Error updating quantity:", err);
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    }
  };

  // Handle item removal
  const handleRemoveItem = async (itemId) => {
    if (!cartData) return;

    try {
      const token = localStorage.getItem("token");
      const customerId = cartData.customer_id;

      const response = await fetch(`/api/cart/${customerId}/remove`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shoppingCartItemId: itemId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to remove item. ${errorText}`);
      }

      // Update the local state to remove the item
      const updatedItems = cartData.items.filter(
        (item) => item.shopping_cart_item_id !== itemId
      );
      setCartData({ ...cartData, items: updatedItems });

      setSnackbar({
        open: true,
        message: "Item removed from cart.",
        severity: "info",
      });
    } catch (err) {
      console.error("Error removing item:", err);
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    }
  };

  // Handle saving item for later
  const handleSaveForLater = async (itemId) => {
    if (!cartData) return;

    const itemToSave = cartData.items.find(
      (item) => item.shopping_cart_item_id === itemId
    );

    if (!itemToSave) return;

    // Optimistically update the UI
    setSavedItems((prev) => [...prev, itemToSave]);
    setCartData((prevData) => ({
      ...prevData,
      items: prevData.items.filter(
        (item) => item.shopping_cart_item_id !== itemId
      ),
    }));

    try {
      const token = localStorage.getItem("token");
      const customerId = cartData.customer_id;

      const response = await fetch(`/api/cart/${customerId}/save`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shopping_cart_item_id: itemId }),
      });

      if (!response.ok) {
        throw new Error("Failed to save item for later.");
      }

      setSnackbar({
        open: true,
        message: "Item saved for later.",
        severity: "success",
      });
    } catch (err) {
      console.error("Error saving item for later:", err);
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    }
  };

  // Handle applying coupon
  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === "SAVE10") {
      setDiscount(calculateSubtotal() * 0.1);
      setSnackbar({
        open: true,
        message: "Coupon applied! 10% discount.",
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: "Invalid coupon code.",
        severity: "error",
      });
    }
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return (
      cartData?.items.reduce(
        (total, item) => total + parseFloat(item.total_price),
        0
      ) || 0
    );
  };

  // Calculate shipping (example logic)
  const calculateShipping = () => {
    return calculateSubtotal() > 50 ? 0 : 15;
  };

  // Calculate tax (example logic)
  const calculateTax = () => {
    return (calculateSubtotal() * 0.08).toFixed(2); // 8% tax
  };

  // Calculate total
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping();
    const tax = parseFloat(calculateTax());
    return (subtotal + shipping + tax - discount).toFixed(2);
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!cartData || cartData.items.length === 0) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
          <ShoppingCartIcon
            sx={{ fontSize: 80, color: theme.palette.primary.main, mb: 2 }}
          />
          <Typography variant="h4" gutterBottom>
            Your cart is empty.
          </Typography>
          <Button variant="contained" color="primary" href="/" sx={{ mt: 4 }}>
            Continue Shopping
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={3} sx={{ p: isMobile ? 2 : 4, borderRadius: 3 }}>
            {/* Cart Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 4,
                flexDirection: isMobile ? "column" : "row",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              <ShoppingCartIcon
                sx={{
                  mr: isMobile ? 0 : 2,
                  mb: isMobile ? 1 : 0,
                  fontSize: 50,
                  color: theme.palette.primary.main,
                }}
              />
              <Typography variant="h4" component="h1">
                Your Shopping Cart
              </Typography>
            </Box>

            {/* Cart Items */}
            <TableContainer component={Paper} sx={{ mb: 4, boxShadow: "none" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartData.items.map((item) => (
                    <Fade in key={item.shopping_cart_item_id}>
                      <TableRow
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          transition: "background-color 0.3s",
                          "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <img
                            src={item.image_url}
                            alt={item.product_name}
                            style={{
                              width: 80,
                              height: 80,
                              objectFit: "cover",
                              marginRight: 16,
                              borderRadius: 12,
                              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {item.product_name}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1" color="text.primary">
                            ${parseFloat(item.total_price) / item.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() =>
                              handleQuantityChange(
                                item.shopping_cart_item_id,
                                -1
                              )
                            }
                            color="primary"
                            size="small"
                            aria-label="decrease quantity"
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography variant="body1" sx={{ mx: 1 }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            onClick={() =>
                              handleQuantityChange(
                                item.shopping_cart_item_id,
                                1
                              )
                            }
                            color="primary"
                            size="small"
                            aria-label="increase quantity"
                          >
                            <AddIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1" color="text.primary">
                            ${parseFloat(item.total_price).toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() =>
                              handleSaveForLater(item.shopping_cart_item_id)
                            }
                            color="secondary"
                            size="small"
                            aria-label="save for later"
                          >
                            <SaveIcon />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handleRemoveItem(item.shopping_cart_item_id)
                            }
                            color="error"
                            size="small"
                            aria-label="remove item"
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    </Fade>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Saved for Later Section */}
            {savedItems.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Saved for Later
                </Typography>
                <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {savedItems.map((item) => (
                        <TableRow key={item.shopping_cart_item_id}>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <img
                              src={`https://source.unsplash.com/60x60/?${encodeURIComponent(
                                item.product_name
                              )}`}
                              alt={item.product_name}
                              style={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                marginRight: 16,
                                borderRadius: 12,
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                              }}
                            />
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500 }}
                            >
                              {item.product_name}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body1" color="text.primary">
                              $
                              {(
                                parseFloat(item.total_price) / item.quantity
                              ).toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="text"
                              color="primary"
                              size="small"
                              onClick={() => {
                                // Move item back to cart
                                setCartData((prev) => ({
                                  ...prev,
                                  items: [...prev.items, item],
                                }));
                                setSavedItems((prev) =>
                                  prev.filter(
                                    (i) =>
                                      i.shopping_cart_item_id !==
                                      item.shopping_cart_item_id
                                  )
                                );
                                setSnackbar({
                                  open: true,
                                  message: "Item moved to cart.",
                                  severity: "success",
                                });
                              }}
                              sx={{
                                textTransform: "none",
                                fontWeight: 600,
                              }}
                            >
                              Move to Cart
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Coupon and Order Summary */}
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 4,
                justifyContent: "space-between",
              }}
            >
              {/* Apply Coupon */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                  Apply Coupon
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 4,
                  }}
                >
                  <TextField
                    variant="outlined"
                    placeholder="Enter coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    size="small"
                    sx={{ mr: 2, flex: 1 }}
                    InputProps={{
                      sx: {
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 1,
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleApplyCoupon}
                    sx={{
                      textTransform: "none",
                      px: 3,
                      py: 1,
                      borderRadius: 1,
                    }}
                  >
                    Apply
                  </Button>
                </Box>
              </Box>

              {/* Order Summary */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Order Summary
                </Typography>
                <Box
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1.5,
                    }}
                  >
                    <Typography>Subtotal</Typography>
                    <Typography>${calculateSubtotal().toFixed(2)}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1.5,
                    }}
                  >
                    <Typography>Shipping</Typography>
                    <Typography>${calculateShipping().toFixed(2)}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1.5,
                    }}
                  >
                    <Typography>Tax (8%)</Typography>
                    <Typography>${calculateTax()}</Typography>
                  </Box>
                  {discount > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1.5,
                      }}
                    >
                      <Typography>Discount</Typography>
                      <Typography color="success.main">
                        -${discount.toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Total
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      ${calculateTotal()}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    href="/checkout"
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: "none",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      transition: "box-shadow 0.3s",
                      "&:hover": {
                        boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Container>
      <Footer />

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Cart;
