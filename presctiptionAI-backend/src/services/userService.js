const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwtHelper = require('../utils/jwtHelper');
const ApiError = require('../utils/ApiError');
const crypto = require('crypto');
const moment = require('../../presctiptionAI-backend/node_modules/moment/ts3.1-typings/moment');

const register = async (userData) => {
    try {
        const { username, email, password } = userData;
        const existingUser = await userModel.findUserByEmail(email);

        if (existingUser) {
            throw new ApiError('User already exists', 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.createUser({ username, email, password: hashedPassword });

        const token = jwtHelper.generateToken({ id: newUser.id, email: newUser.email });

        return { user: newUser, token };
    } catch (error) {
        throw new ApiError(error.message, error.statusCode || 500);
    }
};

const login = async (email, password) => {
    try {
        const user = await userModel.findUserByEmail(email);
        if (!user) throw new ApiError('Invalid credentials', 401);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new ApiError('Invalid credentials', 401);

        const token = jwtHelper.generateToken({ id: user.id, email: user.email });
        return { user: { id: user.id, email: user.email }, token };
    } catch (error) {
        throw new ApiError(error.message, error.statusCode || 500);
    }
};

const generatePasswordResetToken = async (email) => {
    try {
        const user = await userModel.findUserByEmail(email);
        if (!user) throw new ApiError('User not found', 404);

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const tokenExpiry = moment().add(1, 'hour').toDate();

        await userModel.savePasswordResetToken(user.id, hashedToken, tokenExpiry);

        return { message: 'Reset token generated', resetToken };
    } catch (error) {
        throw new ApiError(error.message, error.statusCode || 500);
    }
};

const resetPassword = async (resetToken, newPassword) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const user = await userModel.findUserByResetToken(hashedToken);

        if (!user) throw new ApiError('Invalid or expired token', 400);
        if (moment().isAfter(user.resetTokenExpiry)) throw new ApiError('Token expired', 400);

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await userModel.updateUserPassword(user.id, hashedPassword);

        return { message: 'Password reset successfully' };
    } catch (error) {
        throw new ApiError(error.message, error.statusCode || 500);
    }
};

module.exports = {
    register,
    login,
    generatePasswordResetToken,
    resetPassword,
};
