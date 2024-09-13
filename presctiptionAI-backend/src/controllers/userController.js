const userService = require('../services/userService');
const successResponse = require('../middlewares/responseHandler');

// Controller to register a new user
const register = async (req, res, next) => {
    const { name, email, password } = req.body;
    return userService.register({ name, email, password })
    .then((result) => successResponse(res, result, 'User registered successfully', 201))
    .catch((next));
};

// Controller to login user
const login = async (req, res, next) => {
    const { email, password } = req.body;
    return userService.login(email, password)
    .then((result) => successResponse(res, result, 'User logged in successfully'))
    .catch((next));
};

// Forgot password
const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    return userService.generatePasswordResetToken(email)
    .then((result) => successResponse(res, result, 'Password reset token sent'))
    .catch((next));
};

// Reset password
const resetPassword = async (req, res, next) => {
    const { resetToken, newPassword } = req.body;
    return userService.resetPassword(resetToken, newPassword)
    .then((result) => successResponse(res, result, 'Password reset successfully'))
    .catch((next));
};

exports.loginSuccess = (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "User authenticated",
            user: req.user
        });
    } else {
        res.status(403).json({
            success: false,
            message: "No user logged in"
        });
    }
};


module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
};
