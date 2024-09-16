const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.config();

// Generate JWT token
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.jwtSecret, { expiresIn: '1h' });
};

// Verify JWT token
const verifyToken = (token) => {
    return  jwt.verify(token, process.env.jwtSecret);
};

module.exports = {
    generateToken,
    verifyToken,
};
