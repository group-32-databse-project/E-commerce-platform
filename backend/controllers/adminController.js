// backend/controllers/adminController.js
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.getAdminByEmail(email);
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists with this email.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const adminId = await Admin.createAdmin({
      username,
      email,
      password: hashedPassword
    });

    // Generate JWT
    const token = jwt.sign(
      { adminId },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(201).json({ message: 'Admin registered successfully.', adminId, token });
  } catch (error) {
    console.error('Error in registerAdmin:', error);
    res.status(500).json({ message: 'Server error during admin registration.' });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    const admin = await Admin.getAdminByEmail(email);
    if (!admin) {
      return res.status(400).json({ message: 'Admin not found.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Log the data being used for token generation
    console.log('Creating token for admin:', {
      adminId: admin.admin_id,
      email: admin.email
    });

    const token = jwt.sign(
      { adminId: admin.admin_id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    console.log('Token generated successfully');

    res.status(200).json({ 
      message: 'Admin login successful.',
      adminId: admin.admin_id, 
      token 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during admin login.' });
  }
};

exports.getAdminDashboard = async (req, res) => {
  try {
    // Example response - customize as needed
    res.status(200).json({ message: 'Welcome to the Admin Dashboard.', adminId: req.admin.adminId });
  } catch (error) {
    console.error('Error in getAdminDashboard:', error);
    res.status(500).json({ message: 'Server error accessing dashboard.' });
  }
};
