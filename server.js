import express from 'express';
import path from 'path';
import mysql from 'mysql';
import cors from 'cors'; 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Create connection to MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'j20022008',
    database: 'singlevendorecommerce'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('MySQL connected');
});

// New route to search products based on the input query
app.get('/api/search', (req, res) => {
    
    const searchQuery = req.query.q; // Get the query from the request

    console.log('Search query received:', searchQuery);

    // Check if the search query is provided
    if (!searchQuery) {
        return res.status(400).json({ message: 'Query parameter "q" is required.' });
    }

    const sqlQuery = `SELECT * FROM product WHERE product_name LIKE ?`;
    db.query(sqlQuery, [`%${searchQuery}%`], (err, results) => {
        if (err) {
            console.error('Error fetching data from MySQL:', err);
            return res.status(500).json({ error: 'Internal Server Error' }); // Return proper JSON response
        }
        
        // If no results found, you can return an empty array or a specific message
        if (results.length === 0) {
            return res.status(404).json({ message: 'No products found.' });
        }

        console.log('Search results:', results); // Log the results for debugging
        res.json(results); // Return the results as JSON
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Route to get product details along with their variants
app.get('/api/products', (req, res) => {
    // Query to get product details and related category data
    const productQuery = `
        SELECT 
            product.product_id, product.product_name, product.description, 
            product.category_id, product.weight, 
            variant.total_price, variant.variant_image, 
            variation.name as variation_name, variation_option.value as variation_value,
            variant.variant_id 
        FROM product 
        JOIN variant USING(product_id)
        JOIN product_specification USING (variant_id)
        JOIN variation_option USING (variation_option_id)
        JOIN variation USING (variation_id)
        ORDER BY RAND()  
        LIMIT 12;
    `;

    db.query(productQuery, (err, productResults) => {
        if (err) {
            console.error('Error fetching product data from MySQL:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Products fetched:', productResults);
        res.json(productResults);
    });
});
// Route to get cart items from frontend
var cartproducts = [];
app.post('/api/cart', (req, res) => {
    const cartItem = req.body.id; // This will be a single ID, not an array

    console.log('Cart item received:', cartItem); // Log for debugging

    // Check if cartItem is undefined or null
    if (!cartItem) {
        return res.status(400).json({ message: 'Product ID is required.' });
    }

    // Add the new cart item to the cartproducts array
   
        cartproducts.push(cartItem); // Just push the single ID if it's not already in the cart
    
console.log(cartproducts);
    // Fetch the product details for the given variant IDs
    const sqlQuery = `
        SELECT 
            product.product_id, product.product_name, product.description, 
            product.category_id, product.weight, 
            variant.total_price, variant.variant_image, 
            variation.name as variation_name, variation_option.value as variation_value 
        FROM product 
        JOIN variant USING(product_id)
        JOIN product_specification USING (variant_id)
        JOIN variation_option USING (variation_option_id)
        JOIN variation USING (variation_id)
        WHERE variant.variant_id IN (?)
    `;

    db.query(sqlQuery, [[cartItem]], (err, results) => { // Wrap cartItem in another array
        if (err) {
            console.error('Error fetching cart data from MySQL:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        console.log('Cart item fetched:', results); // Log results for debugging
        res.json(results); // Return the results as JSON
    });
});
