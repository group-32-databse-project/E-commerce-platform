import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Badge,
  IconButton,
  Modal,
  Box,
  Tooltip,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "../assets/styles/allcategory.css";
import { keyframes } from "@mui/system";
import { useNavigate } from "react-router-dom";

// Styled Components

// Enhanced ProductsSection with a new background color and gradient
const ProductsSection = styled("section")(({ theme }) => ({
  padding: theme.spacing(6, 4),
  background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)",
  minHeight: "100vh",
  width: "100%",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
}));

// Refined ProductHeading with animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ProductHeading = styled(Typography)(({ theme }) => ({
  fontSize: "2.5rem",
  fontWeight: 700,
  color: theme.palette.primary.main,
  textAlign: "center",
  marginBottom: theme.spacing(4),
  position: "relative",
  animation: `${fadeIn} 1s ease-out`,
  "&::after": {
    content: '""',
    display: "block",
    width: "60px",
    height: "4px",
    background: theme.palette.secondary.main,
    margin: "15px auto 0",
    borderRadius: "2px",
  },
}));

const onAddToWishlist = (variant_id) => {
  console.log(`Added product ${variant_id} to wishlist`);
};

// Refined StyledCard with improved shadows and transitions
const StyledCard = styled(Card)(({ theme }) => ({
  width: 340,
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.spacing(2),
  border: "none",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  backgroundColor: "#ffffff",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)",
  },
  position: "relative",
  zIndex: 1,
}));

// Improved Media component with consistent height and better hover effect
const Media = styled(CardMedia)(({ theme }) => ({
  width: "100%",
  height: 250,
  backgroundSize: "contain",
  marginTop: theme.spacing(1),
  position: "relative",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  borderRadius: theme.spacing(1),
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  },
}));

// Enhanced Content with better spacing and typography
const Content = styled(CardContent)(({ theme }) => ({
  textAlign: "left",
  flexGrow: 1,
  padding: theme.spacing(2),
}));

// Refined Price typography for better emphasis
const Price = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.main,
  marginTop: theme.spacing(1),
  fontSize: "1.1rem",
}));

// Actions section with horizontally aligned buttons for better accessibility
const Actions = styled(CardActions)(({ theme }) => ({
  display: "flex",
  flexDirection: "row", // Set to row for horizontal alignment
  justifyContent: "space-between",
  padding: theme.spacing(2),
  gap: theme.spacing(2), // Space between buttons
}));

// Rating component remains unchanged
const Rating = ({ value, count }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (value >= i) {
      stars.push(<StarIcon key={i} fontSize="small" color="primary" />);
    } else if (value >= i - 0.5) {
      stars.push(<StarHalfIcon key={i} fontSize="small" color="primary" />);
    } else {
      stars.push(<StarBorderIcon key={i} fontSize="small" color="primary" />);
    }
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      {stars}
      <Typography variant="caption" color="text.secondary">
        ({count})
      </Typography>
    </div>
  );
};

// Enhanced WishlistButton with smoother hover transition and better positioning
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

// Enhanced QuickViewButton with consistent styling
const QuickViewButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  right: theme.spacing(10),
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  zIndex: 3,
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
}));

// Refined Modal Styles for a more polished appearance
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxWidth: 900,
  bgcolor: "background.paper",
  borderRadius: 4,
  boxShadow: 24,
  p: 5,
};

// Enhanced ImageCarousel with improved responsiveness
const ImageCarousel = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "450px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  borderRadius: theme.spacing(1),
}));

// CarouselImage with better hover effect
const CarouselImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "100%",
  objectFit: "contain",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

// CarouselButton with positioned arrows
const CarouselButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
}));

// Enhanced StyledButton with more pronounced styles
const StyledButton = styled(Button)(({ theme, color }) => ({
  flex: 1, // Ensure equal width
  borderRadius: "25px",
  padding: "10px 0", // Adjust padding for uniform height
  fontWeight: 600,
  textTransform: "none",
  fontSize: "0.9rem",
  letterSpacing: "0.5px",
  overflow: "hidden",
  position: "relative",
  transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
  background:
    color === "primary"
      ? "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)"
      : "linear-gradient(45deg, #4CAF50 30%, #45D054 90%)",
  border: "none",
  color: "#ffffff",
  boxShadow:
    color === "primary"
      ? "0 6px 20px 0 rgba(33, 203, 243, 0.4)"
      : "0 6px 20px 0 rgba(76, 175, 80, 0.4)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "200%",
    height: "100%",
    background:
      "linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)",
    transform: "skewX(-25deg)",
    transition: "all 0.5s ease",
  },
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow:
      color === "primary"
        ? "0 12px 25px 0 rgba(33, 203, 243, 0.4)"
        : "0 12px 25px 0 rgba(76, 175, 80, 0.4)",
    "&::before": {
      left: "100%",
      transition: "all 0.5s ease",
    },
  },
  "&:active": {
    transform: "translateY(0px)",
    boxShadow:
      color === "primary"
        ? "0 4px 10px 0 rgba(33, 203, 243, 0.3)"
        : "0 4px 10px 0 rgba(76, 175, 80, 0.3)",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 50%)",
    opacity: 0,
    transition: "opacity 0.5s ease",
  },
  "&:hover::after": {
    opacity: 1,
  },
}));

// ButtonContent and IconWrapper for consistent button layout
const ButtonContent = styled("span")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  position: "relative",
  zIndex: 1,
});

const IconWrapper = styled("span")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  borderRadius: "50%",
  padding: "6px",
  transition: "all 0.3s ease",
  "& svg": {
    fontSize: "1.2rem",
  },
}));

const OurProduct = ({ filters }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9; // Three items per row
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const navigate = useNavigate();

 // Fetch products based on filters
 useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const { categories, subcategories, priceRange } = filters;
      const queryParams = new URLSearchParams();

      if (categories.length > 0) {
        queryParams.append("categories", categories.join(","));
      }

      if (subcategories.length > 0) {
        queryParams.append("subcategories", subcategories.join(","));
      }

      if (priceRange[0] !== 0) {
        queryParams.append("minPrice", priceRange[0]);
      }

      if (priceRange[1] !== 1500) {
        queryParams.append("maxPrice", priceRange[1]);
      }

      const apiEndpoint =
        queryParams.toString() === ""
          ? "/api/products" // No filters applied, fetch all products
          : `/api/filters/products?${queryParams.toString()}`;

      console.log("Fetching Products from:", apiEndpoint);

      const response = await axios.get(apiEndpoint);
      console.log("Fetched Products:", response.data);
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [filters]);


  // Handle Add to Cart
  const onAddToCart = (variantId) => {
    // Implement cart addition logic here
    console.log(`Added variant ${variantId} to cart.`);
    setOpenSnackbar(true);
  };

  // Handle Buy Now

  // Snackbar Close Handler
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Modal Handlers
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
    setCarouselIndex(0);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
  };

  // Carousel Handlers
  const handleNextImage = () => {
    if (selectedProduct) {
      setCarouselIndex((prev) =>
        prev === selectedProduct.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedProduct) {
      setCarouselIndex((prev) =>
        prev === 0 ? selectedProduct.images.length - 1 : prev - 1
      );
    }
  };

  // Add this function to handle navigation

  if (loading) {
    return (
      <ProductsSection>
        <CircularProgress />
      </ProductsSection>
    );
  }

  return (
    <ProductsSection>
      {/* Add a button to navigate home */}
      <ProductHeading variant="h2">Our Products</ProductHeading>
      {products.length === 0 ? (
        <Typography variant="h6" align="center">
          No products found.
        </Typography>
      ) : (
        <>
      <Grid container spacing={4} justifyContent="center">
        {currentProducts.map((product) => (
          <Grid
            item
            key={product.product_id}
            xs={12}
            sm={6}
            md={4} // 3 cards per row on medium and larger screens
            display="flex"
            justifyContent="center"
          >
            <StyledCard>
              {/* Wishlist and Quick View Buttons */}
              <WishlistButton
                aria-label="add to wishlist"
                color="secondary"
                onClick={() => onAddToWishlist(product.product_id)}
              >
                <FavoriteIcon />
              </WishlistButton>

              <QuickViewButton
                aria-label="quick view"
                color="primary"
                onClick={() => handleOpenModal(product)}
              >
                <VisibilityIcon />
              </QuickViewButton>

              {/* Product Image with Badge */}
              <Badge
                badgeContent={
                  product.isFeatured
                    ? "Featured"
                    : product.isNew
                    ? "New"
                    : product.isBestSeller
                    ? "Best Seller"
                    : product.isOnSale
                    ? `${product.discountPercentage}% Off`
                    : null
                }
                color={
                  product.isFeatured
                    ? "secondary"
                    : product.isNew
                    ? "success"
                    : product.isBestSeller
                    ? "warning"
                    : "error"
                }
                invisible={
                  !product.isFeatured &&
                  !product.isNew &&
                  !product.isBestSeller &&
                  !product.isOnSale
                }
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                sx={{
                  zIndex: 2, // Ensure Badge is below buttons but above image
                  "& .MuiBadge-badge": {
                    borderRadius: "8px",
                    padding: "4px 8px",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                  },
                }}
              >
                <Tooltip title={product.product_name} arrow>
                  <Media
                    component="img"
                    image={product.product_image}
                    alt={product.product_name}
                    loading="lazy" // Lazy load images
                  />
                </Tooltip>
              </Badge>

              {/* Product Details */}
              <Content>
                <Typography gutterBottom variant="h6" component="div">
                  {product.product_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description.length > 60
                    ? `${product.description.slice(0, 60)}...`
                    : product.description}
                </Typography>
                <Price>
                  ${product.total_price}
                  {product.isOnSale && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      component="span"
                      style={{
                        textDecoration: "line-through",
                        marginLeft: "8px",
                      }}
                    >
                      ${product.original_price}
                    </Typography>
                  )}
                </Price>
                <Typography variant="body2" color="text.secondary">
                  Weight: {product.weight}
                </Typography>
                <Rating value={product.rating} count={product.ratingCount} />
              </Content>

              {/* Action Buttons */}
              <Actions>
                <StyledButton
                  color="primary"
                  onClick={() => {
                    alert(product.product_id);
                  }}
                  fullWidth
                >
                  <ButtonContent>
                    <IconWrapper>
                      <ShoppingCartIcon />
                    </IconWrapper>
                    Add to Cart
                  </ButtonContent>
                </StyledButton>
                <StyledButton
                  color="success"
                  onClick={() => {
                    navigate(`/product/${product.product_id}`);
                  }}
                  fullWidth
                >
                  <ButtonContent>
                    <IconWrapper>
                      <StarIcon />
                    </IconWrapper>
                    Buy Now
                  </ButtonContent>
                </StyledButton>
              </Actions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
      </>
      )}
      {/* Pagination Controls */}
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        spacing={2}
        style={{ marginTop: "30px" }}
      >
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            startIcon={<ArrowBackIosNewIcon />}
          >
            Previous
          </Button>
        </Grid>
        <Grid item>
          <Typography variant="body1">
            Page {currentPage} of {totalPages}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            endIcon={<ArrowForwardIosIcon />}
          >
            Next
          </Button>
        </Grid>
      </Grid>
      {/* Error Message */}
      {error && (
        <Typography color="error" align="center" style={{ marginTop: "20px" }}>
          {error}
        </Typography>
      )}
      {/* Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Action completed successfully!
        </Alert>
      </Snackbar>
      {/* Quick View Modal */}
      {selectedProduct && (
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="quick-view-title"
          aria-describedby="quick-view-description"
        >
          <Box sx={modalStyle}>
            {/* Product Title */}
            <Typography
              id="quick-view-title"
              variant="h5"
              component="h2"
              gutterBottom
              align="center"
            >
              {selectedProduct.product_name}
            </Typography>

            {/* Image Carousel */}
            <ImageCarousel>
              <CarouselImage
                src={selectedProduct.images[carouselIndex]}
                alt={`${selectedProduct.product_name} Image ${
                  carouselIndex + 1
                }`}
              />
              {selectedProduct.images.length > 1 && (
                <>
                  <CarouselButton
                    onClick={handlePrevImage}
                    aria-label="Previous Image"
                  >
                    <ArrowBackIosNewIcon />
                  </CarouselButton>
                  <CarouselButton
                    onClick={handleNextImage}
                    aria-label="Next Image"
                    style={{ right: 0, left: "auto" }}
                  >
                    <ArrowForwardIosIcon />
                  </CarouselButton>
                </>
              )}
            </ImageCarousel>

            {/* Product Description */}
            <Typography id="quick-view-description" sx={{ mt: 2 }}>
              {selectedProduct.description}
            </Typography>

            {/* Price Information */}
            <Typography variant="h6" sx={{ mt: 2 }}>
              Price: ${selectedProduct.total_price}
              {selectedProduct.isOnSale && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="span"
                  style={{
                    textDecoration: "line-through",
                    marginLeft: "8px",
                  }}
                >
                  ${selectedProduct.original_price}
                </Typography>
              )}
            </Typography>

            {/* Weight and Rating */}
            <Typography variant="body2" color="text.secondary">
              Weight: {selectedProduct.weight}
            </Typography>
            <Rating
              value={selectedProduct.rating}
              count={selectedProduct.ratingCount}
            />

            {/* Tags */}
            <Box
              sx={{
                mt: 2,
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              {selectedProduct.tags.map((tag, index) => (
                <Chip key={index} label={tag} variant="outlined" />
              ))}
            </Box>

            {/* Action Buttons in Modal */}
            <Box
              sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}
            >
              <StyledButton
                color="primary"
                onClick={() => {
                  onAddToCart(selectedProduct.x);
                  handleCloseModal();
                }}
                fullWidth
                sx={{ maxWidth: "200px" }}
              >
                <ButtonContent>
                  <IconWrapper>
                    <ShoppingCartIcon />
                  </IconWrapper>
                  Add to Cart
                </ButtonContent>
              </StyledButton>
            </Box>
          </Box>
        </Modal>
      )}
    </ProductsSection>
  );
};

export default OurProduct;
