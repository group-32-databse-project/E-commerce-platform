import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Header from "../../components/header";
import Footer from "../../components/footer";

const ContactPage = () => {
  return (
    <>
      <Header />
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 8 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Typography
            variant="h2"
            component="h1"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Contact Us
          </Typography>
          <Typography variant="h5" align="center" paragraph sx={{ mb: 6 }}>
            We're here to help and answer any question you might have
          </Typography>

          <Grid container spacing={4}>
            {/* Contact Form */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 4, height: "100%" }}>
                <Typography variant="h4" gutterBottom>
                  Send us a message
                </Typography>
                <form>
                  <TextField
                    fullWidth
                    label="Name"
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    variant="outlined"
                    type="email"
                  />
                  <TextField
                    fullWidth
                    label="Subject"
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Message"
                    margin="normal"
                    variant="outlined"
                    multiline
                    rows={4}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Send Message
                  </Button>
                </form>
              </Paper>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image="/api/placeholder/600/400"
                  alt="C-Store Location"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" gutterBottom>
                    Our Main Store
                  </Typography>
                  <Box display="flex" alignItems="center" mb={2}>
                    <LocationOnIcon sx={{ color: "primary.main", mr: 2 }} />
                    <Typography>123 Main St, Houston, TX 77002</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <PhoneIcon sx={{ color: "primary.main", mr: 2 }} />
                    <Typography>(123) 456-7890</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <EmailIcon sx={{ color: "primary.main", mr: 2 }} />
                    <Typography>contact@cstorstore.com</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <AccessTimeIcon sx={{ color: "primary.main", mr: 2 }} />
                    <Typography>
                      Mon-Fri: 9AM-8PM
                      <br />
                      Sat-Sun: 10AM-6PM
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Map */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h4" gutterBottom>
                  Find Us
                </Typography>
                {/* Replace this with an actual map component if desired */}
                <Box
                  sx={{
                    width: "100%",
                    height: 400,
                    bgcolor: "grey.300",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5" color="text.secondary">
                    Map Placeholder
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Additional Information */}
          <Paper
            elevation={3}
            sx={{
              mt: 6,
              p: 4,
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              We Value Your Feedback
            </Typography>
            <Typography align="center" paragraph>
              At C-Store, we're committed to providing the best shopping
              experience. Your feedback helps us improve our services and meet
              your needs better.
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
                Leave a Review
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default ContactPage;
