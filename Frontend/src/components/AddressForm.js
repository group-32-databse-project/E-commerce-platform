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
        fullName: `${firstName} ${lastName}`,
        addressLine1: address1,
        addressLine2: address2,
        city,
        zipCode: zip,
        isRuralArea: areaType === "rural", // true if rural, false if town
      };
    } else {
      console.error("Please fill in all required fields");
      return null;
    }
  };

  return (
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
    </Grid>
  );
}

