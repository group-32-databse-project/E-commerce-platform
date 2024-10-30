const express = require('express');
const router = express.Router();
const filterController = require('../controllers/filterController');

// GET /api/filters/categories
router.get('/categories', filterController.getCategoriesWithSubcategories);

// GET /api/filters/products
router.get('/products', filterController.getFilteredProducts);

module.exports = router;