import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import HistoryIcon from "@mui/icons-material/History";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";

const AboutPage = () => {

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Hero Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 6,
            borderRadius: 2,
            backgroundImage: 'url("/api/placeholder/1200/400")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 2,
            },
          }}
        >
          <Box position="relative" zIndex={1} textAlign="center" color="white">
            <StorefrontIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography
              variant="h2"
              component="h1"
              sx={{ fontWeight: "bold", mb: 2 }}
            >
              C-Store
            </Typography>
            <Typography variant="h5" sx={{ mb: 4 }}>
              Your Trusted Partner in Quality Products Since 1983
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              Explore Our Story
            </Button>
          </Box>
        </Paper>

        {/* History Section */}
        <Card sx={{ mb: 6, overflow: "visible" }}>
          <Grid container>
            <Grid item xs={12} md={6}>
              <CardMedia
                component="img"
                height="100%"
                image="/api/placeholder/600/400"
                alt="C-Store History"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <HistoryIcon
                    sx={{ fontSize: 30, color: "secondary.main", mr: 2 }}
                  />
                  <Typography variant="h4" component="h2">
                    Our History
                  </Typography>
                </Box>
                <Typography paragraph>
                  Founded in 1983, C-Stor Store has been a pillar of the Texas
                  community for four decades. What started as a small
                  family-owned shop has grown into a trusted name in quality
                  products across the Lone Star State.
                </Typography>
                <Typography paragraph>
                  With 40 years of experience, we've learned to adapt and grow
                  with the times, always keeping our customers' needs at the
                  forefront of our business.
                </Typography>
              </CardContent>
            </Grid>
          </Grid>
        </Card>

        {/* Presence Section */}
        <Card sx={{ mb: 6, overflow: "visible" }}>
          <Grid container>
            <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LocationOnIcon
                    sx={{ fontSize: 30, color: "secondary.main", mr: 2 }}
                  />
                  <Typography variant="h4" component="h2">
                    Our Presence
                  </Typography>
                </Box>
                <Typography paragraph>
                  Over the years, we've established a strong presence across
                  Texas, with branches in major cities serving thousands of
                  satisfied customers. Our local stores have been community
                  landmarks, known for excellent service and quality products.
                </Typography>
                <Typography paragraph>
                  Now, we're excited to bring the C-Stor experience to the
                  digital world, making our extensive range of products
                  available to customers nationwide through our new online
                  platform.
                </Typography>
              </CardContent>
            </Grid>
            <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
              <CardMedia
                component="img"
                height="100%"
                image="/api/placeholder/600/400"
                alt="C-Stor Store Locations"
              />
            </Grid>
          </Grid>
        </Card>

        {/* Products Section */}
        <Card sx={{ mb: 6 }}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <ShoppingBasketIcon
                sx={{ fontSize: 30, color: "secondary.main", mr: 2 }}
              />
              <Typography variant="h4" component="h2">
                Our Products
              </Typography>
            </Box>
            <Typography paragraph>
              At C-Stor Store, we pride ourselves on offering a wide range of
              high-quality products. From household essentials to innovative
              gadgets, we carefully curate our selection to meet the diverse
              needs of our customers. Our commitment to quality and value has
              been the cornerstone of our success for the past 40 years.
            </Typography>
            <Grid container spacing={2} mt={2}>
              {[1, 2, 3, 4].map((item) => (
                <Grid item xs={6} md={3} key={item}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={`/api/placeholder/300/200`}
                      alt={`Product Category ${item}`}
                    />
                    <CardContent>
                      <Typography variant="subtitle1" component="div">
                        Product Category {item}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Join Us in Our Digital Journey
          </Typography>
          <Typography align="center" paragraph>
            Experience the same trust, quality, and customer care that Texas has
            known for 40 years, now from the comfort of your home.
          </Typography>
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                mt: 2,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              Shop Now
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutPage;
