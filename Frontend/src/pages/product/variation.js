import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  List,
  ListItem,
} from "@mui/material";

function Variation({ productId }) {
  const [variations, setVariations] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    // Fetch variations from the backend
    const fetchVariations = async () => {
      try {
        const response = await axios.get(
          `/api/products/${productId}/variations`
        );
        setVariations(response.data);
      } catch (error) {
        console.error("Error fetching variations:", error);
      }
    };

    fetchVariations();
  }, [productId]);

  const handleOptionChange = (variationName, option) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [variationName]: option,
    }));
  };

  return (
    <Box className="variation-container" p={3}>
      {variations.map((variation) => (
        <Paper
          key={variation.id}
          elevation={3}
          sx={{ mb: 4, p: 2 }}
          className="variation"
        >
          <Typography variant="h6" gutterBottom>
            {variation.name}
          </Typography>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select an option</FormLabel>
            <RadioGroup
              name={variation.name}
              value={selectedOptions[variation.name] || ""}
              onChange={(e) =>
                handleOptionChange(variation.name, e.target.value)
              }
            >
              {variation.options.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.value}
                  control={<Radio />}
                  label={option.value}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>
      ))}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Selected Variations:
        </Typography>
        <List>
          {Object.entries(selectedOptions).map(([variation, option]) => (
            <ListItem key={variation}>
              <Typography variant="body1">
                <strong>{variation}:</strong> {option}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default Variation;
