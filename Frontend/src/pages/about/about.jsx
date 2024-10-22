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
  Divider,
  useTheme,
} from "@mui/material";
import {
  Storefront as StorefrontIcon,
  History as HistoryIcon,
  LocationOn as LocationOnIcon,
  ShoppingBasket as ShoppingBasketIcon,
} from "@mui/icons-material";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { motion } from "framer-motion";

const AboutPage = () => {
  const theme = useTheme();

  return (
    <>
      <Header />
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          {/* Hero Section */}
          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            elevation={0}
            sx={{
              p: { xs: 4, md: 8 },
              mb: 8,
              borderRadius: 3,
              backgroundImage: 'url("https://picsum.photos/1200/600?store")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              color: "#fff",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: { xs: 300, md: 500 },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: 3,
              },
            }}
          >
            <Box position="relative" zIndex={1} textAlign="center">
              <StorefrontIcon sx={{ fontSize: 80, mb: 2 }} />
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.6)",
                  fontFamily: "'Roboto Slab', serif",
                }}
              >
                C-Store
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                  fontFamily: "'Open Sans', sans-serif",
                }}
              >
                Elevating Your Shopping Experience Since 1983
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{
                  px: 5,
                  py: 1.5,
                  borderRadius: "50px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                  textTransform: "none",
                  fontWeight: "bold",
                  fontFamily: "'Open Sans', sans-serif",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.3)",
                  },
                }}
                aria-label="Discover More about C-Store"
              >
                Discover More
              </Button>
            </Box>
          </Paper>

          {/* Company Description Section */}
          <Grid container spacing={6} sx={{ mb: 8 }}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontFamily: "'Roboto Slab', serif" }}
              >
                About C-Store
              </Typography>
              <Divider sx={{ width: 60, bgcolor: "secondary.main", mb: 2 }} />
              <Typography
                variant="body1"
                paragraph
                sx={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Founded in 1983, C-Store has been a cornerstone of the Texas
                community for over four decades. What began as a small,
                family-owned shop has grown into a trusted name, renowned for
                delivering quality products and exceptional customer service.
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Our dedication to excellence and community engagement has
                enabled us to adapt and thrive in the ever-evolving retail
                landscape. Today, C-Store stands as a testament to resilience,
                offering a diverse range of products to meet the varied needs of
                our customers both in-store and online.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: theme.shadows[4],
                  height: "100%",
                }}
              >
                <CardMedia
                  component="img"
                  image="https://picsum.photos/600/400?family,store"
                  alt="C-Store Team"
                  sx={{
                    height: "100%",
                    objectFit: "cover",
                  }}
                  loading="lazy"
                />
              </Box>
            </Grid>
          </Grid>

          {/* Our Values Section */}
          <Grid container spacing={6} sx={{ mb: 8 }}>
            <Grid item xs={12} md={4}>
              <Card
                component={motion.div}
                whileHover={{ y: -10, boxShadow: theme.shadows[8] }}
                sx={{
                  borderRadius: 3,
                  padding: 4,
                  textAlign: "center",
                  bgcolor: theme.palette.grey[50],
                }}
              >
                <HistoryIcon
                  sx={{ fontSize: 50, color: "secondary.main", mb: 2 }}
                />
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontFamily: "'Roboto Slab', serif" }}
                >
                  Heritage
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  With a rich history spanning over 40 years, our legacy is
                  built on trust, quality, and unwavering commitment to our
                  customers.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                component={motion.div}
                whileHover={{ y: -10, boxShadow: theme.shadows[8] }}
                sx={{
                  borderRadius: 3,
                  padding: 4,
                  textAlign: "center",
                  bgcolor: theme.palette.grey[50],
                }}
              >
                <ShoppingBasketIcon
                  sx={{ fontSize: 50, color: "secondary.main", mb: 2 }}
                />
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontFamily: "'Roboto Slab', serif" }}
                >
                  Quality
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  We prioritize offering only the finest products, ensuring our
                  customers receive unparalleled value and satisfaction.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                component={motion.div}
                whileHover={{ y: -10, boxShadow: theme.shadows[8] }}
                sx={{
                  borderRadius: 3,
                  padding: 4,
                  textAlign: "center",
                  bgcolor: theme.palette.grey[50],
                }}
              >
                <LocationOnIcon
                  sx={{ fontSize: 50, color: "secondary.main", mb: 2 }}
                />
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontFamily: "'Roboto Slab', serif" }}
                >
                  Community
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  Our deep-rooted connections within the community drive us to
                  support local initiatives and foster meaningful relationships.
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Our Locations Section */}
          <Grid container spacing={6} sx={{ mb: 8 }}>
            <Grid item xs={12} md={6}>
              <Box
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: theme.shadows[4],
                  height: "100%",
                }}
              >
                <CardMedia
                  component="img"
                  image="https://picsum.photos/600/400?store,locations"
                  alt="C-Store Locations"
                  sx={{
                    height: "100%",
                    objectFit: "cover",
                  }}
                  loading="lazy"
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontFamily: "'Roboto Slab', serif" }}
              >
                Our Locations
              </Typography>
              <Divider sx={{ width: 60, bgcolor: "secondary.main", mb: 2 }} />
              <Typography
                variant="body1"
                paragraph
                sx={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                With numerous branches across major Texan cities, C-Store has
                become a familiar name in communities big and small. Each
                location is strategically situated to provide easy access to our
                vast array of products and exceptional services.
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Whether you prefer the personalized experience of our in-store
                shopping or the convenience of our online platform, C-Store is
                committed to meeting your needs wherever you are.
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                sx={{
                  mt: 2,
                  borderRadius: "50px",
                  textTransform: "none",
                  fontWeight: "bold",
                  fontFamily: "'Open Sans', sans-serif",
                  "&:hover": {
                    backgroundColor: "secondary.main",
                    color: "#fff",
                  },
                }}
                aria-label="Find a Store Near You"
              >
                Find a Store Near You
              </Button>
            </Grid>
          </Grid>

          {/* Our Products Section */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              sx={{ fontFamily: "'Roboto Slab', serif" }}
            >
              Our Offerings
            </Typography>
            <Divider
              sx={{ width: 80, bgcolor: "secondary.main", mb: 4, mx: "auto" }}
            />
            <Grid container spacing={4}>
              {[
                {
                  title: "Home Essentials",
                  img: "https://picsum.photos/300/200?home,essentials",
                },
                {
                  title: "Electronics",
                  img: "https://picsum.photos/300/200?electronics",
                },
                {
                  title: "Fashion & Apparel",
                  img: "https://picsum.photos/300/200?fashion,apparel",
                },
                {
                  title: "Health & Wellness",
                  img: "https://picsum.photos/300/200?health,wellness",
                },
              ].map((category, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    component={motion.div}
                    whileHover={{ scale: 1.05 }}
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: theme.shadows[3],
                      cursor: "pointer",
                      transition: "transform 0.3s",
                    }}
                    aria-label={`${category.title} category`}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={category.img}
                      alt={category.title}
                      sx={{ objectFit: "cover" }}
                      loading="lazy"
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        component="div"
                        align="center"
                        sx={{ fontFamily: "'Roboto Slab', serif" }}
                      >
                        {category.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Testimonials Section */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              sx={{ fontFamily: "'Roboto Slab', serif" }}
            >
              What Our Customers Say
            </Typography>
            <Divider
              sx={{ width: 80, bgcolor: "secondary.main", mb: 4, mx: "auto" }}
            />
            <Grid container spacing={4}>
              {[
                {
                  name: "Jane Doe",
                  feedback:
                    "C-Store has been my go-to for quality products. Their customer service is exceptional!",
                  avatar: "https://picsum.photos/100/100?woman,portrait",
                },
                {
                  name: "John Smith",
                  feedback:
                    "I love the variety and the seamless online shopping experience. Highly recommend C-Store!",
                  avatar: "https://picsum.photos/100/100?man,portrait",
                },
                {
                  name: "Emily Johnson",
                  feedback:
                    "C-Store consistently provides top-notch products at great prices. Their commitment to quality is unmatched.",
                  avatar: "https://picsum.photos/100/100?woman,face",
                },
                {
                  name: "Michael Brown",
                  feedback:
                    "Shopping at C-Store is always a pleasure. They understand customer needs and deliver superbly.",
                  avatar: "https://picsum.photos/100/100?man,face",
                },
              ].map((customer, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Box display="flex" alignItems="center">
                    <Box
                      component="img"
                      src={customer.avatar}
                      alt={customer.name}
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        mr: 2,
                        objectFit: "cover",
                        border: `2px solid ${theme.palette.primary.main}`,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontFamily: "'Roboto Slab', serif" }}
                      >
                        {customer.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="textSecondary"
                        sx={{ fontFamily: "'Open Sans', sans-serif" }}
                      >
                        "{customer.feedback}"
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Call-to-Action Section */}
          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            elevation={3}
            sx={{
              p: { xs: 4, md: 8 },
              bgcolor: "primary.main",
              color: "primary.contrastText",
              borderRadius: 3,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontFamily: "'Roboto Slab', serif" }}
            >
              Join Us on Our Digital Journey
            </Typography>
            <Typography
              variant="h6"
              paragraph
              sx={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              Experience unparalleled convenience and the trusted quality of
              C-Store, now available online. Embrace the future of shopping with
              us.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                mt: 2,
                px: 5,
                py: 1.5,
                borderRadius: "50px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                textTransform: "none",
                fontWeight: "bold",
                fontFamily: "'Open Sans', sans-serif",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.3)",
                },
              }}
              aria-label="Shop Now at C-Store"
            >
              Shop Now
            </Button>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default AboutPage;
