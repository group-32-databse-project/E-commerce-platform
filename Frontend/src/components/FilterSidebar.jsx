import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Slider,
  TextField,
  Typography,
  Box,
  Paper,
  ThemeProvider,
  createTheme,
  styled,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#0064D2", // eBay blue
    },
    secondary: {
      main: "#F5AF02", // eBay yellow
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  width: 280,
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: "none",
  "&:before": {
    display: "none",
  },
  "&.Mui-expanded": {
    margin: 0,
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  minHeight: 48,
  "&.Mui-expanded": {
    minHeight: 48,
  },
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  marginLeft: -11,
  marginRight: 0,
}));

const Category = ({ name, children, defaultExpanded = false }) => (
  <StyledAccordion defaultExpanded={defaultExpanded}>
    <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="subtitle1" fontWeight="bold">
        {name}
      </Typography>
    </StyledAccordionSummary>
    <AccordionDetails>{children}</AccordionDetails>
  </StyledAccordion>
);

const CheckboxOption = ({ label, count }) => (
  <StyledFormControlLabel
    control={<Checkbox size="small" color="primary" />}
    label={
      <Typography variant="body2">
        {label} {count && <span style={{ color: "gray" }}>({count})</span>}
      </Typography>
    }
  />
);

const PriceRangeSlider = () => {
  const [priceRange, setPriceRange] = useState([0, 1500]);

  const handleSliderChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleInputChange = (index) => (event) => {
    const newPriceRange = [...priceRange];
    newPriceRange[index] =
      event.target.value === "" ? 0 : Number(event.target.value);
    setPriceRange(newPriceRange);
  };

  return (
    <Box>
      <Slider
        value={priceRange}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        min={0}
        max={1500}
        step={10}
      />
      <Box display="flex" justifyContent="space-between" mt={2}>
        <TextField
          value={priceRange[0]}
          onChange={handleInputChange(0)}
          inputProps={{ min: 0, max: 1500, type: "number" }}
          size="small"
          label="Min"
        />
        <TextField
          value={priceRange[1]}
          onChange={handleInputChange(1)}
          inputProps={{ min: 0, max: 1500, type: "number" }}
          size="small"
          label="Max"
        />
      </Box>
    </Box>
  );
};

const FilterSidebar = () => {
  return (
    <ThemeProvider theme={theme}>
      <StyledPaper>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Filters
        </Typography>

        <Category name="Category" defaultExpanded>
          <Category name="Cell Phones & Accessories">
            <CheckboxOption label="Cell Phone Accessories" />
            <CheckboxOption label="Cell Phone & Smartphone Parts" />
            <CheckboxOption label="Cell Phones & Smartphones" />
            <CheckboxOption label="Smart Watch Accessories" />
            <CheckboxOption label="More" />
          </Category>
          <CheckboxOption label="Computers/Tablets & Networking" />
          <CheckboxOption label="Home & Garden" />
          <CheckboxOption label="Consumer Electronics" />
          <CheckboxOption label="Sports Mem, Cards & Fan Shop" />
          <CheckboxOption label="Clothing, Shoes & Accessories" />
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer", mt: 1, fontWeight: "bold" }}
          >
            Show More
          </Typography>
        </Category>

        <Category name="Model">
          <CheckboxOption label="Apple iPhone 13" count="1,414" />
          <CheckboxOption label="Apple iPhone 14 Pro Max" count="2,742" />
          <CheckboxOption label="Apple iPhone 13 Pro" count="721" />
          <CheckboxOption label="Apple iPhone 13 Pro Max" count="1,303" />
          <CheckboxOption label="Apple iPhone 11" count="1,706" />
          <CheckboxOption label="Apple iPhone 16 Pro Max" count="1,215" />
          <CheckboxOption label="Apple iPhone 13 mini" count="581" />
          <CheckboxOption label="Apple iPhone 11 Pro Max" count="684" />
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer", mt: 1, fontWeight: "bold" }}
          >
            see all
          </Typography>
        </Category>

        <Category name="Price">
          <PriceRangeSlider />
          <CheckboxOption label="Under $290.00" />
          <CheckboxOption label="$290.00 to $360.00" />
          <CheckboxOption label="Over $360.00" />
        </Category>

        <Category name="Condition">
          <CheckboxOption label="New" count="15,713" />
          <CheckboxOption label="Open box" count="1,014" />
          <CheckboxOption label="Certified - Refurbished" count="6" />
          <CheckboxOption label="Excellent - Refurbished" count="446" />
          <CheckboxOption label="Very Good - Refurbished" count="686" />
          <CheckboxOption label="Good - Refurbished" count="529" />
          <CheckboxOption label="Used" count="2,323" />
          <CheckboxOption label="For parts or not working" count="121" />
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer", mt: 1, fontWeight: "bold" }}
          >
            see all
          </Typography>
        </Category>
      </StyledPaper>
    </ThemeProvider>
  );
};

export default FilterSidebar;
