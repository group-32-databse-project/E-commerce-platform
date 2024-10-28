// backend/middlewares/adminAuthenticate.js
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const adminAuthenticate = async (req, res, next) => {
  console.log('Starting authentication...');
  const authHeader = req.headers['authorization'];
  console.log('Auth Header:', authHeader);
  
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Extracted Token:', token);

  if (!token) {
    console.log('No token found');
    return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }

  try {
    console.log('JWT_SECRET:', process.env.JWT_SECRET); // Make sure to remove this in production
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const admin = await Admin.getAdminById(decoded.adminId);
    console.log('Admin found:', admin);

    if (!admin) {
      console.log('No admin found with decoded ID');
      return res.status(401).json({ message: 'Admin not found, authorization denied.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(401).json({ message: 'Token is not valid.', error: error.message });
  }
};

module.exports = adminAuthenticate;
