const userService = require('../services/userService');
const successResponse = require('../middlewares/responseHandler');

// Controller to register a new user
const register = async (req, res, next) => {
    const { username, email, password } = req.body;
    const result = await userService.register({ username, email, password });
    return successResponse(res, result, 'User registered successfully', 201);
};

// Controller to login user
const login = async (req, res, next) => {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    return successResponse(res, result, 'User logged in successfully');
};

// Forgot password
const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    const result = await userService.generatePasswordResetToken(email);
    return successResponse(res, result, 'Password reset token sent');
};

// Reset password
const resetPassword = async (req, res, next) => {
    const { resetToken, newPassword } = req.body;
    const result = await userService.resetPassword(resetToken, newPassword);
    return successResponse(res, result, 'Password reset successfully');
};

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
};
