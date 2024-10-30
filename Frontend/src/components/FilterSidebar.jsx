import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Slider,
  Typography,
  Box,
  Paper,
  ThemeProvider,
  createTheme,
  styled,
  CircularProgress,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";

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

const CheckboxOption = ({ label, checked, onChange }) => (
  <FormControlLabel
    control={<Checkbox checked={checked} onChange={onChange} />}
    label={label}
  />
);

// Price Range Slider Component
const PriceRangeSlider = ({ priceRange, setPriceRange }) => {
  const handleChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleInputChange = (event, index) => {
    const value = Number(event.target.value);
    setPriceRange((prev) => {
      const newRange = [...prev];
      newRange[index] = value;
      return newRange;
    });
  };

  return (
    <Box>
      <Slider
        value={priceRange}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={0}
        max={1500}
        step={50}
      />
      <Box display="flex" justifyContent="space-between" mt={2}>
        <TextField
          label="Min Price"
          type="number"
          value={priceRange[0]}
          onChange={(e) => handleInputChange(e, 0)}
          InputProps={{ inputProps: { min: 0, max: priceRange[1] } }}
          size="small"
          variant="outlined"
        />
        <TextField
          label="Max Price"
          type="number"
          value={priceRange[1]}
          onChange={(e) => handleInputChange(e, 1)}
          InputProps={{ inputProps: { min: priceRange[0], max: 1500 } }}
          size="small"
          variant="outlined"
        />
      </Box>
    </Box>
  );
};

// Category Component for Nested Categories
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

const FilterSidebar = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/filters/categories");
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load categories.");
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle Category Change
  const handleCategoryChange = (categoryId) => (event) => {
    const isChecked = event.target.checked;
    setSelectedCategories((prev) =>
      isChecked ? [...prev, categoryId] : prev.filter((id) => id !== categoryId)
    );
  };

  // Handle Subcategory Change
  const handleSubcategoryChange = (subcategoryId) => (event) => {
    const isChecked = event.target.checked;
    setSelectedSubcategories((prev) =>
      isChecked
        ? [...prev, subcategoryId]
        : prev.filter((id) => id !== subcategoryId)
    );
  };

  // Update parent component when filters change
  useEffect(() => {
    // console.log("Selected Filters:", {
    //   categories: selectedCategories,
    //   subcategories: selectedSubcategories,
    //   priceRange,
    // });
    onFilterChange({
      categories: selectedCategories,
      subcategories: selectedSubcategories,
      priceRange,
    });
  }, [selectedCategories, selectedSubcategories, priceRange, onFilterChange]);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <StyledPaper>
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        </StyledPaper>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <StyledPaper>
          <Typography color="error">{error}</Typography>
        </StyledPaper>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <StyledPaper>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Filters
        </Typography>

        {/* Category Filter */}
        <Category name="Category" defaultExpanded>
          {categories.map((category) => (
            <Box key={category.category_id} sx={{ pl: 2 }}>
              {category.subcategories && category.subcategories.length > 0 ? (
                <Category name={category.category_name}>
                  {category.subcategories.map((subcategory) => (
                    <CheckboxOption
                      key={subcategory.category_id}
                      label={subcategory.category_name}
                      checked={selectedSubcategories.includes(subcategory.category_id)}
                      onChange={handleSubcategoryChange(subcategory.category_id)}
                    />
                  ))}
                </Category>
              ) : (
                <CheckboxOption
                  label={category.category_name}
                  checked={selectedCategories.includes(category.category_id)}
                  onChange={handleCategoryChange(category.category_id)}
                />
              )}
            </Box>
          ))}
        </Category>

        {/* Price Range Filter */}
        <Category name="Price">
          <PriceRangeSlider priceRange={priceRange} setPriceRange={setPriceRange} />
        </Category>
      </StyledPaper>
    </ThemeProvider>
  );
};

export default FilterSidebar;