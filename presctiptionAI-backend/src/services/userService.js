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
        const newUser = await userModel.createUser(name, email, hashedPassword, false);

        const token = jwtHelper.generateToken({ userId: newUser.id, email: newUser.email, isGoogleLogin: false });

        return { user: newUser, token };
    } catch (error) {
        console.error("🚀 ~ register ~ error:", error);
        throw new ApiError(error.message, error.statusCode || 500);
    }
};

const login = async (name, email, password) => {
    try {
        const user = await userModel.findUserByEmail(email);
        console.log("🚀 ~ login ~ user:", user);
        if (!user) throw new ApiError('User not found', 404);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new ApiError('Invalid credentials', 401);

        const token = jwtHelper.generateToken({ userId: user.id, email: user.email, name: user.name, isGoogleLogin: (user.google_id) ? true: false });
        return { user: { userId: user.id, email: user.email, name: user.name }, token, isGoogleLogin: false };
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

const googleLogin = async (params, profile) => {
    let user;
    const payload = {};

    payload.email = params.emails[0].value;
    payload.name = params.displayName;
    payload.isGoogleLogin = true;
    payload.expireIn = profile.expires_in;
    payload.accessToken = profile.access_token;
    payload.refreshToken = profile.refresh_token;

    if (!payload.email) {
        return done(new ApiError('No email found for the user.'), null);
    }

    user = await userModel.findUserByEmail(payload.email);
    
    if (!user) {
        user = await userModel.createUser(payload.name, payload.email, null, true);
    }

    payload.userId = user.id;
    const token = jwtHelper.generateToken(payload);
    payload.token = token;

    return payload
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
        
        if (req?.params?.numberOfDaysList) {
            numberOfDaysList = req?.params?.numberOfDaysList.split(',');
        }
        
        const fitDataList = [];
        for(i = 0; i < numberOfDaysList.length; i++){
    
            // Create the request body with only available data types and the specified duration
            const requestBody = createRequestBodyForGoogleFit(numberOfDaysList[i], 86400000); // Using 7 days and 1 day duration
            // Aggregate the data
            const response = await fitness.users.dataset.aggregate({
                userId: 'me',
                requestBody: requestBody
            });
            const fitBucket = response.data.bucket;
            const bucketList = [];
            fitBucket.forEach(bucket => {
                const output = {
                    fromDate: bucket.startTimeMillis,
                    toDate: bucket.endTimeMillis,
                    step: 0,
                    sleep: 0,
                    calories: 0,
                    heartRate: 0,
                    activeMinutes: 0,
                    activitySegment: 0,
                };
                bucket.dataset.forEach(data => {
                    const dataSourceId = data.dataSourceId;
                    let sum = 0;
            
                    data.point.forEach(point => {
                        point.value.forEach(val => {
                            sum += val.intVal || val.fpVal || 0;
                        });
                    });
            
                    if (dataSourceId.includes("step_count.delta")) {
                        output.step = sum;
                    } else if (dataSourceId.includes("active_minutes")) {
                        output.activeMinutes = sum;
                    } else if (dataSourceId.includes("activity.summary")) {
                        output.activitySegment = sum;
                    } else if (dataSourceId.includes("sleep.segment")) {
                        output.sleep = sum;
                    } else if (dataSourceId.includes("heart_rate.summary")) {
                        output.heartRate = sum;
                    } else if (dataSourceId.includes("calories.expended")) {
                        output.calories = sum;
                    }
                });
                bucketList.push(output);
            })
            fitDataList.push({
                numberOfDays: numberOfDaysList[i],
                fitData: bucketList
            });
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
    // await userModel.saveUser();
    const frontendURL = `http://localhost:4200/home/dashboard?token=${token}`;
    res.redirect(frontendURL);
}

const updateUserDetails = async (userId, gender, height, weight, chest, hips, dateOfBirth) => {
    try {
        const result = await userModel.updateUserDetails(userId, gender, height, weight, chest, hips, dateOfBirth)
        console.log("🚀 ~ updateUserDetails ~ result:", result);

        return result;
    } catch (error) {
        console.error("🚀 ~ register ~ error:", error);
        throw new ApiError(error.message, error.statusCode || 500);
    }
};

const getUserDetails = async (userId) => {
    try {
        const result = await userModel.getUserDetails(userId)
        console.log("🚀 ~ getUserDetails ~ result:", result);

        return result;
    } catch (error) {
        console.error("🚀 ~ register ~ error:", error);
        throw new ApiError(error.message, error.statusCode || 500);
    }
};

module.exports = {
    register,
    login,
    generatePasswordResetToken,
    resetPassword,
    userAuthorizeByGoogle,
    googleLogin,
    handleGoogleCallback,
    fetchGoogleFitData,
    sendDataTFrontend,
    updateUserDetails,
    getUserDetails
};
