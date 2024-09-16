const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('../config/config');
const jwtHelper =require('../utils/jwtHelper')
const userService = require('../services/userService')
const dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.config();
console.log(process.env.googleClientID, process.env.googleClientSecret, process.env.googleCallbackURL)
// Configure Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.googleClientID,
    clientSecret: process.env.googleClientSecret,
    callbackURL: process.env.googleCallbackURL,
    scope: [
        ...config.googleFitScopes,
        ...config.usersScopes
    ],
    passReqToCallback: true,
    accessType: 'offline',
    prompt: 'consent',
    approvalPrompt: 'force'
}, async (req, accessToken, refreshToken, profile, params, done) => {    
    try {

        const payload = await userService.googleLogin(params, profile);
        const token = jwtHelper.generateToken(payload);
        payload.token = token;
        
        done(null, payload);
    } catch (error) {
        console.error('Error during user find or create:', error);
        done(error, false);
    }
}));

passport.serializeUser((payload, done) => {
    done(null, payload);
});

passport.deserializeUser(async (payload, done) => {    
    try {
        if (payload.accessToken) {
            done(null, payload); // Return the user object
        } else {
            done(new Error('User not found'), false);
        }
    } catch (error) {
        console.error('Error during user deserialization:', error);
        done(error, false);
    }
});

module.exports = passport;