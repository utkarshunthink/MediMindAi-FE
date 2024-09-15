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

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();  // Proceed to the next middleware or route handler
    }
    res.redirect('/users/auth/google');  // Redirect to login if not authenticated
}

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization; // Extract token from headers
    console.log("🚀 ~ authenticateUser ~ token:", token, req.headers.authorization);
    if (!token) {
        throw new ApiError('No token provided', 401);
    }

    try {
        const decoded = jwtHelper.verifyToken(token);
        console.log("🚀 ~ authenticateUser ~ decoded:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        throw new ApiError('Invalid token', 401);
    }
};

module.exports = {
    authenticate,
    isAuthenticated,
    authenticateUser
};
