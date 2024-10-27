const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');

// GET /api/products
router.get('/', productController.getProducts);

// GET /api/products/:id/category
router.get('/:id/category', productController.getProductsByCategory);

// GET /api/products/:id
router.get('/:id', productController.getProductById);

// POST /api/products
router.post('/', productController.createProduct);

//get variations and options
router.get("/:id/variations", productController.getVariationAndOptions);

//get c
//router.get("/category/:categoryId", productController.getProductsByCategory);





module.exports = router;