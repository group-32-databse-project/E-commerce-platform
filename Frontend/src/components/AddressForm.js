import * as React from 'react';
import { useState } from "react";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid2";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/system";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Button from "@mui/material/Button";
import saveAddress from "../api/saveAddress";
import {
  Snackbar,
  Alert,
  CircularProgress,
  Fade,
  Typography,
} from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function AddressForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    zip: "",
    areaType: "town",
    saveAddress: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const getValidatedAddress = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "address1",
      "city",
      "zip",
      "areaType",
    ];
    const isValid = requiredFields.every(
      (field) => formData[field].trim() !== ""
    );

    if (isValid) {
      const { firstName, lastName, address1, address2, city, zip, areaType } =
        formData;
      return {
        //address_line1, address_line2,  city, postal_code, is_main_city
        firstName: firstName,
        lastName: lastName,
        address_line1: address1,
        address_line2: address2,
        city: city,
        postal_code: zip,
        is_main_city: areaType !== "rural", // true if rural, false if town
      };
    } else {
      console.error("Please fill in all required fields");
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validatedAddress = getValidatedAddress();
    if (validatedAddress) {
      setLoading(true);
      try {
        await saveAddress(validatedAddress);
        setSuccess(true);
        setSnackbar({
          open: true,
          message: "Address saved successfully!",
          severity: "success",
        });
        // Optionally, reset the form or navigate to another page
        // setFormData({ ... }); // Reset form
        // setTimeout(() => navigate("/next-page"), 2000); // Navigate after 2 seconds
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Error saving address. Please try again.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Grid container spacing={3}>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="first-name" required>
            First name
          </FormLabel>
          <OutlinedInput
            id="first-name"
            name="firstName"
            type="text"
            placeholder="John"
            autoComplete="given-name"
            required
            size="small"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="last-name" required>
            Last name
          </FormLabel>
          <OutlinedInput
            id="last-name"
            name="lastName"
            type="text"
            placeholder="Snow"
            autoComplete="family-name"
            required
            size="small"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </FormGrid>
        <FormGrid size={{ xs: 12 }}>
          <FormLabel htmlFor="address1" required>
            Address line 1
          </FormLabel>
          <OutlinedInput
            id="address1"
            name="address1"
            type="text"
            placeholder="Street name and number"
            autoComplete="shipping address-line1"
            required
            size="small"
            value={formData.address1}
            onChange={handleInputChange}
          />
        </FormGrid>
        <FormGrid size={{ xs: 12 }}>
          <FormLabel htmlFor="address2">Address line 2</FormLabel>
          <OutlinedInput
            id="address2"
            name="address2"
            type="text"
            placeholder="Apartment, suite, unit, etc. (optional)"
            autoComplete="shipping address-line2"
            required
            size="small"
            value={formData.address2}
            onChange={handleInputChange}
          />
        </FormGrid>
        <FormGrid size={{ xs: 6 }}>
          <FormLabel htmlFor="city" required>
            City
          </FormLabel>
          <OutlinedInput
            id="city"
            name="city"
            type="text"
            placeholder="New York"
            autoComplete="City"
            required
            size="small"
            value={formData.city}
            onChange={handleInputChange}
          />
        </FormGrid>

        <FormGrid size={{ xs: 6 }}>
          <FormLabel htmlFor="zip" required>
            Zip / Postal code
          </FormLabel>
          <OutlinedInput
            id="zip"
            name="zip"
            type="text"
            placeholder="12345"
            autoComplete="shipping postal-code"
            required
            size="small"
            value={formData.zip}
            onChange={handleInputChange}
          />
        </FormGrid>
        <FormGrid size={{ xs: 12 }}>
          <FormLabel id="area-type-label">Area Type</FormLabel>
          <RadioGroup
            row
            aria-labelledby="area-type-label"
            name="areaType"
            value={formData.areaType}
            onChange={handleInputChange}
          >
            <FormControlLabel
              value="town"
              control={<Radio />}
              label="Town Area"
            />
            <FormControlLabel
              value="rural"
              control={<Radio />}
              label="Rural Area"
            />
          </RadioGroup>
        </FormGrid>

        {/* make a button to choose in city or not */}

        <FormGrid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Checkbox
                name="saveAddress"
                checked={formData.saveAddress}
                onChange={handleInputChange}
              />
            }
            label="Use this address for payment details"
          />
        </FormGrid>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* ... existing form fields ... */}

            <FormGrid size={{ xs: 12 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                onClick={handleSubmit}
                sx={{ position: "relative" }}
              >
                {loading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                )}
                {success ? "Address Saved" : "Save Address"}
              </Button>
            </FormGrid>
          </Grid>
        </form>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
            icon={
              snackbar.severity === "success" ? (
                <CheckCircleOutline fontSize="inherit" />
              ) : undefined
            }
          >
            <Typography variant="body1">{snackbar.message}</Typography>
          </Alert>
        </Snackbar>

        <Fade in={success} timeout={1000}>
          <Typography
            variant="h6"
            align="center"
            color="primary"
            sx={{ mt: 2, fontWeight: "bold" }}
          >
            Thank you for submitting your address!
          </Typography>
        </Fade>
      </Grid>
    </>
  );
}
