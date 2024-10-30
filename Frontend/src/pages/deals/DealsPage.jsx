import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Timer, 
  LocalOffer,
  Favorite,
  FavoriteBorder
} from '@mui/icons-material';
import Header from '../../components/header';
import Footer from '../../components/footer';
import axios from 'axios';
import { addToWishlist, removeFromWishlist, getWishlist } from '../../services/wishlist';
import { useNavigate } from 'react-router-dom';

// Reusing styled card component pattern from your OurProduct component
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
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
}));

const DiscountBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  backgroundColor: theme.palette.error.main,
  color: 'white',
  fontWeight: 'bold',
  zIndex: 2,
}));

const TimerChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  zIndex: 2,
}));

const DealsPage = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch products and wishlist
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await axios.get('/api/products');
        
        // Filter for products with any type of deal
        const dealsProducts = productsResponse.data.filter(product => 
          product.isOnSale || 
          product.weight < 0.5 ||
          product.isBestSeller ||
          (product.variants && product.variants[0]?.original_price > product.variants[0]?.total_price)
        );

        console.log('Deals Products:', dealsProducts); // Debug log
        setProducts(dealsProducts);

        // Fetch wishlist
        const wishlistData = await getWishlist();
        setWishlist(wishlistData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleWishlistToggle = async (productId, event) => {
    event.stopPropagation();
    const isInWishlist = wishlist.some(item => item.product_id === productId);
    try {
      if (isInWishlist) {
        await removeFromWishlist(productId);
        setWishlist(prev => prev.filter(item => item.product_id !== productId));
      } else {
        await addToWishlist(productId);
        setWishlist(prev => [...prev, { product_id: productId }]);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Deals Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ 
            fontWeight: 700,
            color: 'primary.main',
            position: 'relative',
            display: 'inline-block',
            '&::after': {
              content: '""',
              display: 'block',
              width: '60px',
              height: '4px',
              background: (theme) => theme.palette.secondary.main,
              margin: '15px auto 0',
              borderRadius: '2px',
            }
          }}>
            Today's Best Deals
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Incredible deals with amazing discounts!
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Typography variant="h6" align="center" sx={{ my: 4 }}>
            No deals available at the moment.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid item key={product.product_id} xs={12} sm={6} md={4}>
                <StyledCard onClick={() => navigate(`/product/${product.product_id}`)}>
                  {(product.discountPercentage > 0 || product.isOnSale) && (
                    <DiscountBadge 
                      label={`-${product.discountPercentage || 
                        Math.round(((product.variants[0]?.original_price - product.variants[0]?.total_price) / 
                        product.variants[0]?.original_price) * 100)}%`}
                      icon={<LocalOffer sx={{ fontSize: 16 }} />}
                    />
                  )}
                  
                  {/* Wishlist Button */}
                  <IconButton
                    aria-label="add to wishlist"
                    onClick={(event) => handleWishlistToggle(product.product_id, event)}
                    color="secondary"
                  >
                    {wishlist.some(item => item.product_id === product.product_id) 
                      ? <Favorite /> 
                      : <FavoriteBorder />
                    }
                  </IconButton>

                  <CardMedia
                    component="img"
                    height="240"
                    image={product.product_image}
                    alt={product.product_name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="h2" noWrap>
                      {product.product_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" color="primary.main">
                        ${product.variants?.[0]?.total_price || 'N/A'}
                      </Typography>
                      {product.isOnSale && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: 'line-through' }}
                        >
                          ${product.variants?.[0]?.original_price || 'N/A'}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button
                      variant="contained"
                      sx={{ flexGrow: 1, mr: 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product.product_id}`);
                      }}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default DealsPage; 