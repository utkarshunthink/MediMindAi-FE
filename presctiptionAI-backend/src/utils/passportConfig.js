const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('../config/config');
const { findOrCreateUser } = require('../models/userModel');
const pool = require('../startup/db/pool');
const jwtHelper =require('../utils/jwtHelper')
const userService = require('../services/userService')

// Configure Google Strategy
passport.use(new GoogleStrategy({
    clientID: config.googleConfig.googleClientID,
    clientSecret: config.googleConfig.googleClientSecret,
    callbackURL: config.googleConfig.callbackURL,
    scope: [
        ...config.googleFitScopes,
        ...config.usersScopes
    ],
    passReqToCallback: true,
    accessType: 'offline',
    prompt: 'consent',
    approvalPrompt: 'force'
}, async (req, accessToken, refreshToken, profile, params, done) => {
    console.log(params, 'papapa')
    console.log(profile, 'prprpr')
    
    try {

        // const result = await userService.googleLogin(params, profile);
        const payload = {}
        payload.email = params.emails[0].value
        payload.name = params.displayName;
        payload.userId = params.id;
        payload.googleLogin = true;
        payload.expireIn = profile.expires_in
        payload.accessToken = profile.access_token;
        payload.refreshToken = profile.refresh_token

        if (!payload.email) {
            return done(new Error('No email found for the user.'), null);
        }

        // const token = ''
        // const user = await findOrCreateUser({ email, name, id, accessToken, refreshToken });

        const token = jwtHelper.generateToken(payload);
        payload.token = token;
        console.log("🚀 ~ token:", token);
        // user.accessToken = accessToken;
        // user.refreshToken = refreshToken;

        done(null, payload);
    } catch (error) {
        console.error('Error during user find or create:', error);
        done(error, false);
    }
}));

passport.serializeUser((payload, done) => {
    console.log("🚀 ~ passport.serializeUser ~ user:", payload);
    done(null, payload);
});

passport.deserializeUser(async (payload, done) => {
    console.log("🚀 ~ passport.deserializeUser ~ user:", payload);
    
    try {
        result = {rows: ['aa']}
        // const result = await pool.query('SELECT * FROM users WHERE id = $1', [user.id]);
        if (result.rows.length > 0) {
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