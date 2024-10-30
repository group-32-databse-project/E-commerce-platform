import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Container,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import Header from '../../components/header';
import Footer from '../../components/footer';

const Cart = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true);
      try {
        const customerId = localStorage.getItem('customerId');
        const token = localStorage.getItem('token');

        if (!customerId || !token) {
          throw new Error('Customer ID or token not found. Please log in.');
        }

        const response = await axios.get(`/api/cart/${customerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setCartData(response.data);
      } catch (err) {
        console.error('Error fetching cart data:', err);
        setError(err.message);
        setSnackbar({
          open: true,
          message: err.message,
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Box sx={{ textAlign: 'center', mt: 5 }}>
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
        <Footer />
      </>
    );
  }

  if (!cartData?.items?.length) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
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
        {/* Render cart items */}
      </Container>
      <Footer />

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Cart;