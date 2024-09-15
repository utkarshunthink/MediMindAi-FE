const userService = require('../services/userService');
const successResponse = require('../middlewares/responseHandler');
const config = require('../config/config');


// Controller to register a new user
const register = async (req, res, next) => {
    const { name, email, password } = req.body;
    return userService.register({ name, email, password })
    .then((result) => successResponse(res, result, 'User registered successfully', 201))
    .catch((next));
};

// Controller to login user
const login = async (req, res, next) => {
    const { name, email, password } = req.body;
    return userService.login(name, email, password)
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

const googleCallbackRedirect = async (req, res) => {
    return userService.handleGoogleCallback(req, res);
};
    

const fetchGoogleFitData = async (req, res, next) => {
    return userService.fetchGoogleFitData(req, res, next)
    .then((result) => successResponse(res, result, 'Google Fit data fetched Data successfully'))
    .catch((next));
} 

const sendDataTFrontend = async = (req, res, next) => {
    return userService.sendDataTFrontend(req, res);
}

const updateUserDetails = async (req, res, next) => {
    const {gender, height, weight, chest, hips, dateOfBirth } = req.body;
    const userId = req.user.userId;
    return userService.updateUserDetails(userId, gender, height, weight, chest, hips, dateOfBirth)
    .then((result) => successResponse(res, result, 'User details updated successfully', 201))
    .catch((next));
};

const getUserDetails = async = (req, res, next) => {
    const userId = req.user.userId;
    console.log("🚀 ~ getUserDetails ~ userId:", userId);
    return userService.getUserDetails(userId)
    .then((result) => successResponse(res, result, 'User details fetched successfully', 201))
    .catch((next));}

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
    googleCallbackRedirect,
    fetchGoogleFitData,
    sendDataTFrontend,
    updateUserDetails,
    getUserDetails
};
