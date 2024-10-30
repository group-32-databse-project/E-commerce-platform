import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

// Import banner images from the correct path
import toyBanner from "../../assets/images/toy_banner.jpeg";
import electronicsBanner from "../../assets/images/electronics_banner.jpeg";

// Styled Components
const BannerContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "500px", // Increased height for better image visibility
  marginBottom: theme.spacing(6),
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.down("sm")]: {
    height: "350px",
  },
}));

const BannerSection = styled(Box, {
  shouldForwardProp: (prop) => prop !== "bgImage" && prop !== "isActive",
})(({ theme, bgImage, isActive }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  borderRadius: theme.shape.borderRadius,
  backgroundImage: `url(${bgImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  color: "white",
  boxShadow: isActive ? "0 6px 10px rgba(0, 0, 0, 0.25)" : "none",
  opacity: isActive ? 1 : 0,
  transition: "opacity 1s ease-in-out",
  pointerEvents: isActive ? "auto" : "none",
}));

const Overlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: alpha("#000", 0.3), // Slightly lighter overlay
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  width: "100%",
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  [theme.breakpoints.down("sm")]: {
    alignItems: "center",
    textAlign: "center",
  },
}));

const ProductsGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const ProductCard = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.85),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  textAlign: "center",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.06)",
    boxShadow: theme.shadows[6],
  },
}));

const ProductImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "180px", // Reduced height for better layout
  objectFit: "cover",
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const Banner = () => {
  const [toysProducts, setToysProducts] = useState([]);
  const [electronicsProducts, setElectronicsProducts] = useState([]);
  const [isLoadingToys, setIsLoadingToys] = useState(true);
  const [isLoadingElectronics, setIsLoadingElectronics] = useState(true);
  const [errorToys, setErrorToys] = useState(null);
  const [errorElectronics, setErrorElectronics] = useState(null);

  // Array of banners for rotation
  const banners = [
    {
      id: 1,
      bgImage: toyBanner,
      title: "Explore our Toy Collection",
      products: toysProducts,
      isLoading: isLoadingToys,
      error: errorToys,
      fetchFunction: async () => {
        try {
          const response = await axios.get("/api/banner/toys");
          if (response.data && response.data.success) {
            setToysProducts(response.data.products);
          } else {
            setErrorToys(response.data.message || "Failed to fetch toys products.");
          }
        } catch (error) {
          setErrorToys(error.message || "Error fetching toys products.");
        } finally {
          setIsLoadingToys(false);
        }
      },
    },
    {
      id: 2,
      bgImage: electronicsBanner,
      title: "Electronics for Every Need",
      products: electronicsProducts,
      isLoading: isLoadingElectronics,
      error: errorElectronics,
      fetchFunction: async () => {
        try {
          const response = await axios.get("/api/banner/electronics");
          if (response.data && response.data.success) {
            setElectronicsProducts(response.data.products);
          } else {
            setErrorElectronics(response.data.message || "Failed to fetch electronics products.");
          }
        } catch (error) {
          setErrorElectronics(error.message || "Error fetching electronics products.");
        } finally {
          setIsLoadingElectronics(false);
        }
      },
    },
  ];

  useEffect(() => {
    // Fetch products for both banners
    banners.forEach((banner) => {
      banner.fetchFunction();
    });
  }, []);

  // State for current active banner
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prevBanner) => (prevBanner + 1) % banners.length);
    }, 7500); // Switch every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <BannerContainer>
      {banners.map((banner, index) => (
        <BannerSection
          key={banner.id}
          bgImage={banner.bgImage}
          isActive={index === currentBanner}
        >
          <Overlay />
          <ContentWrapper>
            <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
              {banner.title}
            </Typography>

            {banner.isLoading ? (
              <Box display="flex" justifyContent="center" mt={2}>
                <CircularProgress color="inherit" />
              </Box>
            ) : banner.error ? (
              <Alert severity="error">{banner.error}</Alert>
            ) : (
              <ProductsGrid container spacing={3}>
                {banner.products.map((product) => (
                  <Grid item xs={12} sm={4} key={product.product_id}>
                    <ProductCard>
                      <Link href={`/product/${product.product_id}`} color="inherit" underline="none">
                        <ProductImage
                          src={product.product_image}
                          alt={product.product_name}
                          loading="lazy"
                        />
                        <Typography variant="h6" color="text.primary">
                          {product.product_name}
                        </Typography>
                      </Link>
                    </ProductCard>
                  </Grid>
                ))}
              </ProductsGrid>
            )}
          </ContentWrapper>
        </BannerSection>
      ))}
    </BannerContainer>
  );
};

export default Banner;