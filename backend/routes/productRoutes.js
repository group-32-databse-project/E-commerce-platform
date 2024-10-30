const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');

router.get('/new-arrivals', productController.getRecentArrivals);

// GET /api/products
router.get('/', productController.getAllProducts);

// GET /api/products/:id/category
router.get('/:id/category', productController.getProductsByCategory);

// GET /api/products/:id
router.get('/:id', productController.getProductById);

// POST /api/products
router.post('/', productController.createProduct);

//get variations and options
router.get("/:id/variations", productController.getVariationAndOptions);

module.exports = router;