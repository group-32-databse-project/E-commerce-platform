const jwt = require('jsonwebtoken');
const { executeQuery } = require('../utils/db');

exports.verifyToken = (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    // Ensure userId is defined
    const userId = decoded.id;
    if (!userId) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    try {
      // Ensure userId is not undefined
      const user = await executeQuery('SELECT * FROM customer WHERE customer_id = ?', [userId]);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'Token is valid', user });
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
};