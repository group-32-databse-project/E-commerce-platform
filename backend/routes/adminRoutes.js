const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../config/database');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/categories')
    },
    filename: function (req, file, cb) {
        cb(null, `category-${Date.now()}${path.extname(file.originalname)}`)
    }
});

const upload = multer({ storage: storage });

// Category Routes
router.post('/categories', async (req, res) => {
    console.log('Received category data:', req.body);
    try {
        const { category_name, parent_category_id, category_image } = req.body;

        if (!category_name || !category_image) {
            return res.status(400).json({ message: 'Category name and image are required' });
        }

        const query = `
            INSERT INTO category (category_name, parent_category_id, category_image) 
            VALUES (?, ?, ?)
        `;

        const [result] = await pool.query(query, [
            category_name, 
            parent_category_id || null, 
            category_image
        ]);

        res.status(201).json({
            category_id: result.insertId,
            category_name,
            parent_category_id,
            category_image
        });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ message: 'Error adding category' });
    }
});

router.get('/categories', async (req, res) => {
    try {
        const [categories] = await pool.query('SELECT * FROM category ORDER BY category_name');
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories' });
    }
});

router.delete('/categories/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM category WHERE category_id = ?', [req.params.id]);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Error deleting category' });
    }
});

// Product Routes
// Add product
router.post('/products', async (req, res) => {
    console.log('Received product data:', req.body);
    try {
        const { 
            product_id,
            category_id, 
            product_name, 
            description, 
            product_image,
            weight,
            rating 
        } = req.body;

        // Validate required fields
        if (!product_id || !category_id || !product_name) {
            return res.status(400).json({ 
                message: 'Product ID, category ID, and product name are required' 
            });
        }

        // Check if category exists
        const [categoryCheck] = await pool.query(
            'SELECT category_id FROM category WHERE category_id = ?', 
            [category_id]
        );

        if (categoryCheck.length === 0) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        const query = `
            INSERT INTO product (
                product_id, 
                category_id, 
                product_name, 
                description, 
                product_image,
                weight,
                rating
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.query(query, [
            product_id,
            category_id,
            product_name,
            description || null,
            product_image || null,
            weight || null,
            rating || 0.0
        ]);

        res.status(201).json({
            message: 'Product added successfully',
            product: {
                product_id,
                category_id,
                product_name,
                description,
                product_image,
                weight,
                rating
            }
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ 
            message: 'Error adding product',
            error: error.message 
        });
    }
});

// Get all products
router.get('/products', async (req, res) => {
    try {
        const [products] = await pool.query(`
            SELECT p.*, c.category_name 
            FROM product p 
            JOIN category c ON p.category_id = c.category_id 
            ORDER BY p.product_name
        `);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// Get product by ID
router.get('/products/:id', async (req, res) => {
    try {
        const [products] = await pool.query(
            'SELECT * FROM product WHERE product_id = ?',
            [req.params.id]
        );
        
        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json(products[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Error fetching product' });
    }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM product WHERE product_id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product' });
    }
});

module.exports = router;