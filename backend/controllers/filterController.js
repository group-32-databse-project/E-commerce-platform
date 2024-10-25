const Filter = require('../models/Filter');

exports.getCategoriesWithSubcategories = async (req, res) => {
  try {
    const categories = await Filter.getCategoriesWithSubcategories();
    res.json(categories);
  } catch (error) {
    console.error('Error in getCategoriesWithSubcategories:', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.toString() });
  }
};

exports.getFilteredProducts = async (req, res) => {
  try {
    const { categories, subcategories, minPrice, maxPrice } = req.query;

    // Parse categories and subcategories into arrays
    const categoryIds = categories ? categories.split(',').map(id => parseInt(id)) : [];
    const subcategoryIds = subcategories ? subcategories.split(',').map(id => parseInt(id)) : [];

    // Define price range
    const priceRange = {};
    if (minPrice) priceRange.min = parseFloat(minPrice);
    if (maxPrice) priceRange.max = parseFloat(maxPrice);

    const products = await Filter.getFilteredProducts({ categoryIds, subcategoryIds, priceRange });
    res.json(products);
  } catch (error) {
    console.error('Error in getFilteredProducts:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.toString() });
  }
};