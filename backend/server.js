const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');


// Load environment variables
dotenv.config();

// Import routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reportRoutes = require('./routes/reportRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const searchRoutes = require('./routes/searchRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const paymentRoutes = require("./routes/paymentRoutes");
const testRoutes = require('./routes/testRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); // Import Notification Routes
const filterRoutes = require('./routes/filterRoutes'); 
const bannerRoutes = require('./routes/bannerRoutes');


const adminRoutes = require('./routes/adminRoutes'); // New Admin Routes

// Initialize express
const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/search', searchRoutes);
app.use('/api', authRoutes);
app.use('/api/notifications', notificationRoutes); // Register Notification Routes
app.use('/api/category', categoryRoutes); // Optional: Review if duplicate
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/filters', filterRoutes);
app.use('/api/banner', bannerRoutes);
app.use("/api/admin", adminRoutes); // New Admin Routes
app.use(`/api/payments`, paymentRoutes);
app.use("/api/test", testRoutes);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
