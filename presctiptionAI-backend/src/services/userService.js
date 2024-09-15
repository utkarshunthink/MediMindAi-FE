const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwtHelper = require('../utils/jwtHelper');
const ApiError = require('../utils/ApiError');
const crypto = require('crypto');
const config = require('../config/config');
const moment = require('moment');
const passport = require('passport');
const { google } = require('googleapis');

// const passport = require('./../utils/passportConfig');

const register = async (userData) => {
    try {
        const { name, email, password } = userData;
        const existingUser = await userModel.findUserByEmail(email);

        if (existingUser) {
            throw new ApiError('User already exists', 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.createUser({ name, email, password: hashedPassword });
        console.log("🚀 ~ register ~ newUser:", newUser);

        const token = jwtHelper.generateToken({ id: newUser.id, email: newUser.email });

        return { user: newUser, token };
    } catch (error) {
        console.error("🚀 ~ register ~ error:", error);
        throw new ApiError(error.message, error.statusCode || 500);
    }
};

const login = async (email, password) => {
    try {
        const user = await userModel.findUserByEmail(email);
        if (!user) throw new ApiError('User not found', 404);

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

const userAuthorizeByGoogle = () => {
    return passport.authenticate('google', {
        scope: [
            ...config.googleFitScopes,
            ...config.usersScopes
        ]
    })
}

// Service function to handle the Google OAuth callback
const handleGoogleCallback = async (req, res) => {
    console.log("🚀 ~ handleGoogleCallback ~ req:", req.user);
    try {
        // Check if the authentication is successful (you can add custom logic if needed)
        if (!req.user) {
            throw new ApiError('Authentication failed', 401);
        }

        // On success, log the response and redirect
        console.log("🚀 ~ res:", res.body, res.data);
        res.redirect('/users/success');
    } catch (error) {
        // On error, log the error and redirect to a failure page
        console.error("Error during Google authentication:", error);
        res.redirect('/users/failed');
    }
};

const googleLogin = (params, profile) => {
    const payload = {}
    payload.email = params.emails[0].value
    payload.name = params.displayName;
    payload.userId = params.id;
    payload.googleLogin = true;
    payload.expireIn = profile.expires_in
    payload.accessToken = profile.access_token;
    payload.refreshToken = profile.refresh_token

    const TOKEN_LIFETIME = payload.expireIn * 1000;  // example value from Google OAuth response
    // const accessTokenIssueTime = Date.now();
    // const tokenExpiryTime = accessTokenIssueTime + (TOKEN_LIFETIME * 1000);  // Store expiry time in milliseconds

    // Get the current timestamp
    const accessTokenIssueTime = moment();

    // Calculate the expiry time by adding the token lifetime
    const tokenExpiryTime = accessTokenIssueTime.clone().add(TOKEN_LIFETIME, 'milliseconds');

    // Format both the issue time and expiry time
    const formattedIssueTime = accessTokenIssueTime.format('YYYY-MM-DD HH:mm:ss.SSSSSS');
    const formattedExpiryTime = tokenExpiryTime.format('YYYY-MM-DD HH:mm:ss.SSSSSS');

    console.log("Access Token Issue Time:", formattedIssueTime);  // e.g., "2024-09-14 15:03:29.878997"
    console.log("Token Expiry Time:", formattedExpiryTime);
    if (!payload.email) {
        return done(new ApiError('No email found for the user.'), null);
    }

    const token = jwtHelper.generateToken(payload);
    console.log("🚀 ~ token:", token);
}

function createRequestBodyForGoogleFit(startOffsetDays = 7, durationMillis = 86400000) {

    const aggregates = config.googleFitAggregates;

    return {
        aggregateBy: aggregates,
        bucketByTime: {
            durationMillis: durationMillis  // Duration in milliseconds
        },
        startTimeMillis: Date.now() - (startOffsetDays * 24 * 60 * 60 * 1000), // Days ago
        endTimeMillis: Date.now()
    };
}

const fetchGoogleFitData = async (req, res, next) => {
    console.log("🚀 ~ fetchGoogleFitData.get ~ req:", req.user, req.query);

    // Check for authenticated user
    if (!req.user || !req.user.accessToken) {
        throw new ApiError('User not authenticated or missing access token', 401);
    }

    const accessToken = req.user.accessToken;
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const fitness = google.fitness({ version: 'v1', auth: oauth2Client });

    try {

        let numberOfDaysList = [1];
        const fitDataList = [];

        if (req?.params?.numberOfDaysList) {
            numberOfDaysList = req?.params?.numberOfDaysList.split(',');
        }

        for(i = 0; i < numberOfDaysList.length; i++){
    
            // Create the request body with only available data types and the specified duration
            const requestBody = createRequestBodyForGoogleFit(numberOfDaysList[i], 86400000); // Using 7 days and 1 day duration
            console.log("🚀 ~ fetchGoogleFitData ~ requestBody:", requestBody);
            // Aggregate the data
            const response = await fitness.users.dataset.aggregate({
                userId: 'me',
                requestBody: requestBody
            });
            fitDataList.push(response.data);
        }

        if(!fitDataList.length){
            throw new ApiError('Error fetching Google Fit data', 500);
        }
        // Send the aggregated data as response
        return fitDataList;
    } catch (error) {
        console.error('Error fetching Google Fit data:', error);
        throw new ApiError('Error fetching Google Fit data:', 500)
    }
};

const sendDataTFrontend = (req, res) => {
    const userObj = req.user || null;
    const token = userObj?.token || '';
    const frontendURL = `http://localhost:4200/home/dashboard?token=${token}`;
    res.redirect(frontendURL);
}

module.exports = {
    register,
    login,
    generatePasswordResetToken,
    resetPassword,
    userAuthorizeByGoogle,
    googleLogin,
    handleGoogleCallback,
    fetchGoogleFitData,
    sendDataTFrontend
};
