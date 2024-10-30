import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  Typography,
  Button,
  Box,
  IconButton,
  CircularProgress,
  Chip,
  CardMedia,
  CardContent,
  Paper,
  Container,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Star as StarIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Header from '../components/header';
import Footer from '../components/footer';
import { getWishlist, removeFromWishlist, addToWishlist } from '../services/wishlist';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Using the same theme and styling approach as the product page
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Styled Components
const WishlistSection = styled('section')(({ theme }) => ({
  padding: theme.spacing(6, 4),
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
  minHeight: '100vh',
  width: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
}));

const WishlistCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  maxWidth: '1000px',
  margin: '0 auto',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  },
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
  width: 250,
  height: 250,
  objectFit: 'cover',
  borderRadius: theme.spacing(1),
  marginRight: theme.spacing(3),
}));

const ProductInfo = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '25px',
  padding: '10px 20px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
  },
}));

// Add these styled components after the existing StyledButton definition
const WishlistButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  zIndex: 3,
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
}));

// Rest of your existing modal style
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

// Add these new styled components after existing ones
const RecommendedSection = styled(Box)(({ theme }) => ({
  overflowX: 'auto',
  overflowY: 'hidden',
  whiteSpace: 'nowrap',
  padding: theme.spacing(2),
  '&::-webkit-scrollbar': {
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
    '&:hover': {
      background: '#555',
    },
  },
}));

const RecommendedCard = styled(Card)(({ theme }) => ({
  display: 'inline-block',
  width: 340,
  marginRight: theme.spacing(2),
  whiteSpace: 'normal',
  verticalAlign: 'top',
  borderRadius: theme.spacing(2),
  border: 'none',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  backgroundColor: '#ffffff',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
  },
  position: 'relative',
  zIndex: 1,
}));

// Main Component
const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
    };

    const fetchWishlist = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const wishlistData = await getWishlist();
        setWishlist(wishlistData || []);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchWishlist();
  }, [token]);

  const handleWishlistToggle = async (productId) => {
    const isInWishlist = wishlist.some((item) => item.product_id === productId);
    try {
      if (isInWishlist) {
        await removeFromWishlist(productId);
        setWishlist((prev) => prev.filter((item) => item.product_id !== productId));
      } else {
        await addToWishlist(productId);
        setWishlist((prev) => [...prev, { product_id: productId }]);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const handleProceedToProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const getRecommendedProducts = () => {
    if (wishlistProducts.length === 0) {
      // If wishlist is empty, return random products
      return products
        .sort(() => Math.random() - 0.5) // Shuffle the array
        .slice(0, 7); // Get first 7 products
    }

    // Original logic for when wishlist has items
    const wishlistCategories = new Set(
      wishlistProducts.map(product => product.category)
    );

    const recommended = products
      .filter(product => 
        wishlistCategories.has(product.category) && 
        !wishlist.some(item => item.product_id === product.product_id)
      )
      .slice(0, 7);

    return recommended;
  };

  if (loading) {
    return (
      <>
        <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!token) {
    return (
      <>
        <Header />
        <WishlistSection>
          <Typography variant="h5" align="center" sx={{ mt: 4 }}>
            Please login to view your wishlist.
          </Typography>
        </WishlistSection>
        <Footer />
      </>
    );
  }

  const wishlistProducts = products.filter((product) =>
    wishlist.some((item) => item.product_id === product.product_id)
  );
  const recommendedProducts = products.filter(
    (product) => !wishlist.some((item) => item.product_id === product.product_id)
  );

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <WishlistSection>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
            Your Wishlist
          </Typography>
          
          {wishlistProducts.length > 0 ? (
            wishlistProducts.map((product) => (
              <WishlistCard key={product.product_id}>
                <ProductImage
                  component="img"
                  image={product.product_image}
                  alt={product.product_name}
                  onClick={() => handleProceedToProduct(product.product_id)}
                  sx={{ cursor: 'pointer' }}
                />
                
                <ProductInfo>
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      {product.product_name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {(product.tags || []).map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag} 
                          variant="outlined" 
                          sx={{ borderRadius: '16px' }}
                        />
                      ))}
                    </Box>
                  </Box>
                  
                  <ActionButtons>
                    <StyledButton
                      variant="contained"
                      color="primary"
                      endIcon={<StarIcon />}
                      onClick={() => handleProceedToProduct(product.product_id)}
                    >
                      View Full Details
                    </StyledButton>
                    <StyledButton
                      variant="outlined"
                      color="secondary"
                      startIcon={<Favorite />}
                      onClick={() => handleWishlistToggle(product.product_id)}
                    >
                      Remove from Wishlist
                    </StyledButton>
                  </ActionButtons>
                </ProductInfo>
              </WishlistCard>
            ))
          ) : (
            <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
              Your wishlist is empty. Check out our recommendations below!
            </Typography>
          )}

          {products.length > 0 && (
            <>
              <Typography variant="h4" sx={{ mt: 6, mb: 2 }}>
                {wishlistProducts.length > 0 ? 'Recommended Products' : 'Products You Might Like'}
              </Typography>
              <RecommendedSection>
                {getRecommendedProducts().map((product) => (
                  <RecommendedCard key={product.product_id}>
                    <WishlistButton onClick={(e) => {
                      e.stopPropagation();
                      handleWishlistToggle(product.product_id);
                    }}>
                      {wishlist.some((item) => item.product_id === product.product_id) ? (
                        <Favorite color="secondary" />
                      ) : (
                        <FavoriteBorder />
                      )}
                    </WishlistButton>

                    <CardMedia
                      component="img"
                      height="200"
                      image={product.product_image}
                      alt={product.product_name}
                      onClick={() => handleProceedToProduct(product.product_id)}
                      sx={{ 
                        cursor: 'pointer',
                        objectFit: 'contain',
                        padding: '16px'
                      }}
                    />

                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        onClick={() => handleProceedToProduct(product.product_id)}
                        sx={{ 
                          cursor: 'pointer',
                          whiteSpace: 'normal',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          height: '64px'
                        }}
                      >
                        {product.product_name}
                      </Typography>
                      <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {(product.tags || []).slice(0, 3).map((tag, index) => (
                          <Chip 
                            key={index} 
                            label={tag} 
                            variant="outlined"
                            sx={{ margin: '2px' }}
                          />
                        ))}
                      </Box>
                    </CardContent>

                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      p: 2,
                      gap: 1
                    }}>
                      <StyledButton
                        variant="contained"
                        color="primary"
                        endIcon={<StarIcon />}
                        onClick={() => handleProceedToProduct(product.product_id)}
                      >
                        View Full Details
                      </StyledButton>
                    </Box>
                  </RecommendedCard>
                ))}
              </RecommendedSection>
            </>
          )}
        </Container>
      </WishlistSection>
      <Footer />
    </ThemeProvider>
  );
};

export default Wishlist;
