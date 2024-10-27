import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  ThemeProvider,
  createTheme,
  Button,
  Avatar,
  LinearProgress,
  useMediaQuery,
  AppBar,
  Toolbar,
  CssBaseline,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  LocalShipping as LocalShippingIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  ShoppingBag as ShoppingBagIcon,
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getAddress } from "../services/getAddress";
import { getOrder } from "../services/getOrder";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#BB86FC",
    },
    secondary: {
      main: "#03DAC6",
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    success: {
      main: "#00C853",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 3,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          padding: "8px 24px",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1E1E1E",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        },
      },
    },
  },
});

const OrderConfirmation = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [address, setAddress] = useState(null);
  const [order, setOrder] = useState(null);

  // Updated useEffect to handle async function correctly
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const fetchedAddress = await getAddress();
        console.log("address fetched:", fetchedAddress);
        setAddress(fetchedAddress);
      } catch (error) {
        console.error("Failed to fetch address:", error);
      }
    };
    fetchAddress();
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const fetchedOrder = await getOrder();
        console.log("order fetched:", fetchedOrder);
        setOrder(fetchedOrder);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      }
    };
    fetchOrder();
  }, []);

  console.log("address", address);
  console.log("order", order);

  const orderDetails = {
    orderId: "ORD-2024-10275",
    orderDate: "October 27, 2024",
    expectedDelivery: "October 30, 2024",
    status: "Order Confirmed",
    progress: 25,
    items: [
      {
        id: 1,
        name: "Wireless Headphones",
        quantity: 1,
        price: 129.99,
        image: "🎧",
      },
      { id: 2, name: "Phone Case", quantity: 2, price: 24.99, image: "📱" },
    ],
    shipping: {
      name: "John Doe",
      address: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      method: "Express Shipping (2-3 days)",
    },
    subtotal: 179.97,
    shippingCost: 9.99,
    tax: 14.4,
    total: 204.36,
  };

  return (
    <Grid container justifyContent="center">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <AppBar position="fixed" elevation={0}>
            <Toolbar>
              <Button
                //back button back page
                onClick={() => navigate(-1)}
                color="inherit"
                startIcon={<ArrowBackIcon />}
                sx={{ mr: 2 }}
              >
                Back
              </Button>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Order Details
              </Typography>
              <Button
                onClick={() => navigate("/")}
                color="primary"
                startIcon={<ShoppingBagIcon />}
                variant="contained"
                size={isMobile ? "small" : "medium"}
              >
                Continue Shopping
              </Button>
            </Toolbar>
          </AppBar>
          <Toolbar /> {/* Spacer for fixed AppBar */}
          <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4, mt: 2 }}>
            <Grid container spacing={3}>
              {/* Left Column */}
              <Grid item xs={12} md={8}>
                {/* Success Header */}
                <Paper sx={{ p: 4, mb: 3, textAlign: "center" }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: "background.paper",
                      mx: "auto",
                      mb: 3,
                      boxShadow: (theme) =>
                        `0 0 20px ${theme.palette.primary.main}40`,
                    }}
                  >
                    <CheckCircleIcon
                      sx={{ fontSize: 40, color: "primary.main" }}
                    />
                  </Avatar>
                  <Typography variant="h4" gutterBottom>
                    Order Confirmed!
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    gutterBottom
                  >
                    Thank you for your purchase
                  </Typography>
                  <Chip
                    icon={<CheckCircleIcon />}
                    label={orderDetails.status}
                    color="success"
                    sx={{ mt: 2 }}
                  />

                  {/* Added Buttons for Shopping */}
                  <Box
                    sx={{
                      mt: 4,
                      display: "flex",
                      justifyContent: "center",
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ShoppingBagIcon />}
                      size={isMobile ? "small" : "medium"}
                      onClick={() => navigate("/")}
                    >
                      Continue Shopping
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<ShoppingCartIcon />}
                      size={isMobile ? "small" : "medium"}
                      onClick={() => navigate("/cart")}
                    >
                      View Cart
                    </Button>
                  </Box>
                </Paper>

                {/* Progress Section */}
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Order Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={orderDetails.progress}
                    sx={{ height: 8, borderRadius: 4, mb: 2 }}
                  />
                  <Grid container spacing={2} justifyContent="space-between">
                    <Grid item>
                      <Typography variant="body2" color="primary">
                        Order Placed
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2" color="text.secondary">
                        Processing
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2" color="text.secondary">
                        Shipped
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2" color="text.secondary">
                        Delivered
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Shipping Information */}
                <Paper sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <LocationOnIcon sx={{ mr: 2, color: "primary.main" }} />
                    <Typography variant="h6">Shipping Information</Typography>
                  </Box>
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      gutterBottom
                    >
                      {orderDetails.shipping.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {orderDetails.shipping.address}
                      <br />
                      {orderDetails.shipping.city},{" "}
                      {orderDetails.shipping.state} {orderDetails.shipping.zip}
                    </Typography>
                  </Paper>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LocalShippingIcon
                      sx={{ mr: 1, color: "secondary.main" }}
                    />
                    <Typography variant="body2" color="secondary.main">
                      {orderDetails.shipping.method}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={4}>
                {/* Order Details Card */}
                <Paper sx={{ p: 3, mb: 3, position: "sticky", top: 88 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <AccessTimeIcon sx={{ mr: 2, color: "primary.main" }} />
                    <Typography variant="h6">Order Details</Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Order Number
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {orderDetails.orderId}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Order Date
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {orderDetails.orderDate}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Expected Delivery
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="medium"
                        color="secondary"
                      >
                        {orderDetails.expectedDelivery}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  {/* Order Summary */}
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Subtotal
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: "right" }}>
                      <Typography variant="body1">
                        ${orderDetails.subtotal.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Shipping
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: "right" }}>
                      <Typography variant="body1">
                        ${orderDetails.shippingCost.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Tax
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: "right" }}>
                      <Typography variant="body1">
                        ${orderDetails.tax.toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 2 }} />
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography variant="h6">Total</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: "right" }}>
                      <Typography variant="h6" color="primary">
                        ${orderDetails.total.toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      startIcon={<DownloadIcon />}
                      size={isMobile ? "small" : "medium"}
                    >
                      Download Invoice
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="primary"
                      startIcon={<PrintIcon />}
                      size={isMobile ? "small" : "medium"}
                    >
                      Print Order
                    </Button>
                  </Box>

                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <EmailIcon color="primary" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      A confirmation email has been sent to your email address
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </ThemeProvider>
    </Grid>
  );
};

export default OrderConfirmation;
