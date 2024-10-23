const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.customerId = decoded.customerId;
        console.log("customerId", req.customerId);

        // Send the customerId to the frontend
        res.setHeader('X-Customer-Id', req.customerId);
        next();
    });
};

module.exports = verifyToken;