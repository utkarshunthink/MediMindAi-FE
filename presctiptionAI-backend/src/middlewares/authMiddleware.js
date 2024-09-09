const jwtHelper = require('../utils/jwtHelper');
const ApiError = require('../utils/ApiError');

// Middleware to authenticate users using JWT
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from headers
    if (!token) {
        throw new ApiError('No token provided', 401);
    }

    try {
        const decoded = jwtHelper.verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        throw new ApiError('Invalid token', 401);
    }
};

module.exports = authenticate;
