const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');

router.post('/verify-token', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Token is valid' });
});

module.exports = router;