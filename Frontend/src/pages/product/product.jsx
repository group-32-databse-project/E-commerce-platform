import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Link,
  Paper,
  Divider,
  Rating,
  ThemeProvider,
  createTheme,
  styled,
  Container,
} from "@mui/material";
import {
  FavoriteBorder,
  Info as InfoIcon,
  ChevronLeft,
  ChevronRight,
  LocalShipping,
  Security,
  Bolt,
  ShoppingCart,
} from "@mui/icons-material";
import Header from "../../components/header";
import Footer from "../../components/footer";

// Create a custom theme with standard measurements and professional style
const theme = createTheme({
  palette: {
    primary: {
      main: "#1E88E5",
      light: "#62B0E8",
      dark: "#005CB2",
    },
    secondary: {
      main: "#FF5722",
    },
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: "1.75rem",
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.43,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: "none",
          fontWeight: 500,
          padding: "8px 16px",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input": {
            padding: "10px 12px",
          },
        },
      },
    },
  },
});

// Styled components
const StyledImageContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  "&:hover": {
    "& .MuiIconButton-root": {
      opacity: 1,
    },
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "rgba(255,255,255,0.9)",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,1)",
  },
  opacity: 0,
  transition: "opacity 0.3s ease-in-out",
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
}));

const ProductPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  // Sample images with standardized dimensions
  const images = Array(5)
    .fill()
    .map(() => `https://picsum.photos/800/600?random=${Math.random()}`);

  return (
    <>
      <Header />
      <ThemeProvider theme={theme}>
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
          <Container maxWidth="xl">
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 4 }}>
              <Grid container spacing={6}>
                {/* Left column - Images */}
                <Grid item xs={12} md={7} lg={8}>
                  <StyledImageContainer>
                    <StyledChip
                      label="213 VIEWED IN LAST 24 HOURS"
                      color="error"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        zIndex: 1,
                      }}
                    />
                    <CardMedia
                      component="img"
                      image={images[activeImage]}
                      alt="Product Image"
                      sx={{
                        height: { xs: 350, sm: 450, md: 550 },
                        objectFit: "cover",
                      }}
                    />
                    <StyledIconButton
                      sx={{ position: "absolute", top: 16, right: 16 }}
                      size="small"
                    >
                      <FavoriteBorder />
                    </StyledIconButton>
                    <StyledIconButton
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: 16,
                        transform: "translateY(-50%)",
                      }}
                      onClick={() =>
                        setActiveImage((prev) =>
                          prev === 0 ? images.length - 1 : prev - 1
                        )
                      }
                    >
                      <ChevronLeft />
                    </StyledIconButton>
                    <StyledIconButton
                      sx={{
                        position: "absolute",
                        top: "50%",
                        right: 16,
                        transform: "translateY(-50%)",
                      }}
                      onClick={() =>
                        setActiveImage((prev) =>
                          prev === images.length - 1 ? 0 : prev + 1
                        )
                      }
                    >
                      <ChevronRight />
                    </StyledIconButton>
                  </StyledImageContainer>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mt: 3,
                      overflowX: "auto",
                      pb: 1,
                    }}
                  >
                    {images.map((img, index) => (
                      <CardMedia
                        key={index}
                        component="img"
                        image={img}
                        alt={`Thumbnail ${index + 1}`}
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: 2,
                          cursor: "pointer",
                          flexShrink: 0,
                          border: 2,
                          borderColor:
                            activeImage === index
                              ? "primary.main"
                              : "transparent",
                          transition: "border-color 0.3s ease",
                          "&:hover": { borderColor: "primary.light" },
                        }}
                        onClick={() => setActiveImage(index)}
                      />
                    ))}
                  </Box>
                </Grid>

                {/* Right column - Product details */}
                <Grid item xs={12} md={5} lg={4}>
                  <Typography variant="h4" gutterBottom color="primary.dark">
                    Apple MacBook Pro 13" Late 2020 M1 1TB SSD 16GB RAM Space
                    Gray - Good
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      src="https://picsum.photos/24/24"
                      sx={{ width: 32, height: 32, mr: 1.5 }}
                    />
                    <Typography variant="body1" fontWeight="medium" mr={1.5}>
                      The Cellular Professor eBay Store
                    </Typography>
                    <StyledChip
                      label="Top Rated Seller"
                      size="small"
                      color="secondary"
                      sx={{ mr: 1.5 }}
                    />
                    <Rating value={4.5} precision={0.5} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary" ml={1}>
                      (17,527)
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
                    <Link
                      href="#"
                      variant="body1"
                      color="primary"
                      fontWeight="medium"
                    >
                      Seller's other items
                    </Link>
                    <Link
                      href="#"
                      variant="body1"
                      color="primary"
                      fontWeight="medium"
                    >
                      Contact seller
                    </Link>
                  </Box>
                  <Divider sx={{ my: 4 }} />
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="primary.dark"
                    gutterBottom
                  >
                    US $811.99
                  </Typography>
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      Condition:{" "}
                      <Typography component="span" fontWeight="normal" ml={1}>
                        Good - Refurbished
                      </Typography>{" "}
                      <InfoIcon
                        fontSize="small"
                        color="action"
                        sx={{ ml: 1, cursor: "pointer" }}
                      />
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      "This Product has been determined to be fully working by
                      our industry leading functionality"...{" "}
                      <Link href="#" color="primary" fontWeight="medium">
                        Read more
                      </Link>
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                    <Typography variant="body1" mr={2}>
                      Quantity:
                    </Typography>
                    <TextField
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.max(
                            1,
                            Math.min(100, parseInt(e.target.value) || 1)
                          )
                        )
                      }
                      inputProps={{ min: 1, max: 100 }}
                      size="small"
                      sx={{ width: 80 }}
                    />
                    <Typography variant="body2" color="text.secondary" ml={2}>
                      More than 10 available • 10 sold
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      mb: 4,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<ShoppingCart />}
                      sx={{ height: 48 }}
                    >
                      Buy It Now
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      sx={{ height: 48 }}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<FavoriteBorder />}
                      sx={{ height: 48 }}
                    >
                      Add to Watchlist
                    </Button>
                  </Box>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      mb: 4,
                      bgcolor: "primary.light",
                      color: "white",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <Bolt sx={{ mr: 1 }} />
                      This one's trending. 10 have already sold.
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Bolt sx={{ mr: 1 }} />
                      People want this. 168 people are watching this.
                    </Typography>
                  </Paper>
                  <Box sx={{ mt: 4 }}>
                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <LocalShipping
                        fontSize="small"
                        sx={{ mr: 1, color: "primary.main" }}
                      />
                      <strong>Shipping:</strong> US $74.05 eBay International
                      Shipping{" "}
                      <InfoIcon
                        fontSize="small"
                        color="action"
                        sx={{ ml: 0.5, cursor: "pointer" }}
                      />
                      <Link
                        href="#"
                        color="primary"
                        sx={{ ml: 1, fontWeight: 500 }}
                      >
                        See details
                      </Link>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                      sx={{ ml: 3 }}
                    >
                      Located in: Prospect Heights, IL, United States
                    </Typography>
                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center", mt: 2 }}
                    >
                      <Security
                        fontSize="small"
                        sx={{ mr: 1, color: "primary.main" }}
                      />
                      <strong>Import Charges:</strong> This item may be subject
                      to import charges and taxes on delivery{" "}
                      <InfoIcon
                        fontSize="small"
                        color="action"
                        sx={{ ml: 0.5, cursor: "pointer" }}
                      />
                    </Typography>
                    <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
                      <strong>Delivery:</strong>{" "}
                      <StyledChip
                        label="Estimated between Tue, Dec 3 and Wed, Dec 25"
                        size="small"
                        sx={{ ml: 1, bgcolor: "primary.light", color: "white" }}
                      />
                      <InfoIcon
                        fontSize="small"
                        color="action"
                        sx={{
                          ml: 0.5,
                          cursor: "pointer",
                          verticalAlign: "middle",
                        }}
                      />
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 3, mt: 0.5 }}
                    >
                      Please note the delivery estimate is{" "}
                      <strong>greater than 30 business days</strong>
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Similar Items */}
            <Paper elevation={0} sx={{ p: 4 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                color="primary.dark"
              >
                Similar Items
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <StyledChip label="Sponsored" size="small" />
                <Box>
                  <Link
                    href="#"
                    variant="body2"
                    color="primary"
                    sx={{ mr: 2, fontWeight: 500 }}
                  >
                    Feedback on our suggestions
                  </Link>
                  <Link
                    href="#"
                    variant="body2"
                    color="primary"
                    sx={{ fontWeight: 500 }}
                  >
                    See All
                  </Link>
                </Box>
              </Box>
              <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={num}>
                    <Card
                      sx={{
                        "&:hover": { boxShadow: 6 },
                        transition: "box-shadow 0.3s",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={`https://picsum.photos/200/150?random=${num}`}
                        alt={`Similar item ${num}`}
                        sx={{ height: 150, objectFit: "cover" }}
                      />
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            noWrap
                            sx={{ flexGrow: 1 }}
                          >
                            Apple MacBook Pro 13" M1
                          </Typography>
                          <IconButton size="small">
                            <FavoriteBorder fontSize="small" />
                          </IconButton>
                        </Box>
                        <Typography
                          variant="body2"
                          color="primary.dark"
                          fontWeight="bold"
                          mt={1}
                        >
                          $799.99
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Container>
        </Box>
      </ThemeProvider>
      <Footer />
    </>
  );
};

export default ProductPage;