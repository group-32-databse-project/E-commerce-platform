const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const categorycontroller = require('../controllers/categoryController');

// GET /api/products
router.get('/', productController.getAllProducts);

// GET /api/products/:id
router.get('/:id', productController.getProductById);

// POST /api/products
router.post('/', productController.createProduct);

router.get('/category/:id', categorycontroller.getcatogeryById);
router.get('/category', categorycontroller.getAllCatogory);
router.get('/category/ele&toy', categorycontroller.getEleAndToy);

module.exports = router;