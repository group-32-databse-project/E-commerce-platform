const categoryController = require('../controllers/categoryController');
const express = require('express');
const router = express.Router();

// GET /api/category/electronics
router.get('/electronics', categoryController.getElecs);

// GET /api/category/toys
router.get('/toys', categoryController.getToys);

// GET /api/category/toys-and-electronics
router.get('/toys-and-electronics', categoryController.getToysAndElectronics);

// GET /api/category/id/:id
router.get('/id/:id', categoryController.getCategoryById);

// GET /api/category
router.get('/', categoryController.getAllCategories);

module.exports = router;