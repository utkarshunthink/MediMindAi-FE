const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config/config');

// Generate JWT token
const generateToken = (payload) => {
    return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
};

// Verify JWT token
const verifyToken = (token) => {
    return  jwt.verify(token, jwtSecret);
};

module.exports = {
    generateToken,
    verifyToken,
};
