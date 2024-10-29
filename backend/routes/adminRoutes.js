const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

        return res.json({
            "status": 200,
            "category_id": result.insertId,
            "category_name": category_name,
            "parent_category_id": parent_category_id,
            "category_image": category_image
        });
    } catch (error) {
        console.error('Error adding category:', error);
        return res.json({
            "status": 500,
            "message": 'Error adding category',
            "error": error.sqlMessage
        });
    }
});

router.get('/categories', async (req, res) => {
    try {
        const [categories] = await pool.query('SELECT * FROM category ORDER BY category_name');
        return res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return res.json({
            "status": 500,
            "message": 'Error fetching categories',
            "error": error.sqlMessage
        });
    }
});

router.delete('/categories/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM category WHERE category_id = ?', [req.params.id]);
        return res.json({
            "status": 200,
            "message": 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        return res.json({
            "status": 500,
            "message": 'Error deleting category',
            "error": error.sqlMessage
        });
    }
});

// Product Routes
// Add product
router.post('/products', async (req, res) => {
    try {
        const { 
            category_id, 
            product_name, 
            description, 
            product_image,
            weight,
            rating 
        } = req.body;

        // Validate required fields
        if (!category_id || !product_name) {
            return res.json({ 
                "status": 400,
                "message": 'Category ID and product name are required' 
            });
        }
        console.log('Product data:', req.body);

        // // Check if category exists
        // const [categoryCheck] = await pool.query(
        //     'SELECT category_id FROM category WHERE category_id = ?', 
        //     [category_id]
        // );

        // console.log('Category check:', categoryCheck);
        // if (categoryCheck.length === 0) {
        //     return res.status(400).json({ message: 'Invalid category ID' });
        // }
        const query = `

            INSERT INTO product (
                category_id, 
                product_name, 
                description, 
                product_image,
                weight,
                rating
            ) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.query(query, [
            category_id,
            product_name,
            description || null,
            product_image || null,
            weight || null,
            rating || 0.0
        ]);

        console.log('Product added successfully:', result);
        return res.json({
            "status": 200,
            "message": 'Product added successfully',
            "product": {
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
        return res.json({ 
            "status": 500,
            "message": 'Error adding product',
            "error": error.sqlMessage 
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
        return res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ message: error.sqlMessage });
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
        
        return res.json(products[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        return res.status(500).json({ message: 'Error fetching product' });
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

        return res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ message: 'Error deleting product' });
    }
});

router.post('/sales_report', async (req, res) => {
    console.log('Received sales report data:', req.body);
    try {
        const [salesReport] = await pool.query(
            'CALL getReport(?, ?, ?, ?, ?, ?, ?)',
            [
                req.body.order_time || "Monthly",
                req.body.payment_method === 'All' ? null : req.body.payment_method || null,
                req.body.delivery_method === 'All' ? null : req.body.delivery_method || null,
                req.body.total_order_price_min || null,
                req.body.total_order_price_max || null,
                req.body.order_status === 'All' ? null : req.body.order_status || null,
                req.body.quantity || null
            ]
        );
        console.log('Sales report fetched successfully:', salesReport);
        return res.json({
            "status": 200,
            "message": 'Sales report fetched successfully',
            "data": salesReport[0]
        }); // Stored procedure returns result set in first element
    } catch (error) {
        console.error('Error fetching sales report:', error);
        return res.json({
            "status": 500,
            "message": 'Error fetching sales report',
            "error": error.sqlMessage
        });
    }
});


// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt for username:', username);

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Get admin from database
        const [admins] = await pool.query(
            'SELECT * FROM admin WHERE email = ?',
            [username]
        );

        if (admins.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const admin = admins[0];

        // Compare password with hashed password in database
        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create simple token (you can enhance this later)
        const token = 'admin-token-' + Date.now();

        return res.json({
            message: 'Login successful',
            token,
            admin: {
                admin_id: admin.admin_id,
                username: admin.username,
                email: admin.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Error logging in' });
    }
});

// Admin Signup
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log('Signup attempt for username:', username);

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email and password are required' });
        }

        // Check if email already exists
        const [existingAdmins] = await pool.query(
            'SELECT * FROM admin WHERE email = ?',
            [email]
        );

        if (existingAdmins.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new admin with hashed password
        const [result] = await pool.query(
            'INSERT INTO admin (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        // Create token for new admin
        const token = 'admin-token-' + Date.now();

        return res.json({
            message: 'Signup successful',
            token,
            admin: {
                admin_id: result.insertId,
                username,
                email
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ message: 'Error creating account' });
    }
});

module.exports = router;