const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const testRoutes = require('./routes/testRoutes');
const customerRoutes = require('./routes/customerRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reportRoutes = require('./routes/reportRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const searchRoutes = require('./routes/searchRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

// Use routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/test', testRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/search', searchRoutes);
app.use('/api', authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});