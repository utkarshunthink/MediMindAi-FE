// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const config = require('../config/config');
// const { findOrCreateUser } = require('../models/userModel');
// const pool = require('../startup/db/pool');
// const jwtHelper = require('../utils/jwtHelper');
// const { google } = require('googleapis');

// // Add scopes for Google Fit API
// const googleFitScopes = [
//     'https://www.googleapis.com/auth/fitness.activity.read',
//     'https://www.googleapis.com/auth/fitness.heart_rate.read',
//     'https://www.googleapis.com/auth/fitness.location.read',
//     'https://www.googleapis.com/auth/fitness.blood_glucose.read',
//     'https://www.googleapis.com/auth/fitness.blood_pressure.read',
//     'https://www.googleapis.com/auth/fitness.body.read',
//     'https://www.googleapis.com/auth/fitness.body_temperature.read',
//     'https://www.googleapis.com/auth/fitness.nutrition.read',
//     'https://www.googleapis.com/auth/fitness.oxygen_saturation.read',
//     'https://www.googleapis.com/auth/fitness.sleep.read'
// ];

// passport.use(new GoogleStrategy({
//     clientID: config.googleConfig.googleClientID,
//     clientSecret: config.googleConfig.googleClientSecret,
//     callbackURL: config.callbackURL,
//     scope: ['profile', 'email', ...googleFitScopes], // Including both Google Fit and profile scopes
//     passReqToCallback: true // Allows passing req to the callback
// }, async (accessToken, refreshToken, profile, done) => {
//     console.log("🚀 ~ accessToken, refreshToken:", accessToken, refreshToken);
//     try {
//         const user = await findOrCreateUser({
//             email: profile.emails[0].value,
//             name: profile.displayName,
//             id: profile.id,
//         });
        
//         user.accessToken = accessToken,
//         user.refreshToken = refreshToken
//         // Create a JWT token
//         // const token = jwtHelper.generateToken({ id: user.id, email: user.email });
//         // console.log("🚀 ~ token:", token);
//         done(null, user);
//     } catch (error) {
//         done(error, false);
//     }
// }));

// passport.serializeUser((user, done) => {
//     console.log("🚀 ~ passport.serializeUser ~ user:", user);
//     done(null, user);
// });

// passport.deserializeUser((user, done) => {
//     console.log("🚀 ~ passport.deserializeUser ~ id:", user);
//     // Use the user ID to fetch user details
//     return pool.query('SELECT * FROM users WHERE id = $1', [user.id], (err, result) => {
//         if (err) {
//             return done(err, false);
//         }
//         done(null, user);
//     });
// });

// module.exports = passport;



const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('../config/config');
const { findOrCreateUser } = require('../models/userModel');
const pool = require('../startup/db/pool');

// Add scopes for Google Fit API
const googleFitScopes = [
    'https://www.googleapis.com/auth/fitness.activity.read',
    'https://www.googleapis.com/auth/fitness.heart_rate.read',
    'https://www.googleapis.com/auth/fitness.location.read',
    'https://www.googleapis.com/auth/fitness.blood_glucose.read',
    'https://www.googleapis.com/auth/fitness.blood_pressure.read',
    'https://www.googleapis.com/auth/fitness.body.read',
    'https://www.googleapis.com/auth/fitness.body_temperature.read',
    'https://www.googleapis.com/auth/fitness.nutrition.read',
    'https://www.googleapis.com/auth/fitness.oxygen_saturation.read',
    'https://www.googleapis.com/auth/fitness.sleep.read'
];

// Configure Google Strategy
passport.use(new GoogleStrategy({
    clientID: config.googleConfig.googleClientID,
    clientSecret: config.googleConfig.googleClientSecret,
    callbackURL: config.callbackURL,
    scope: ['profile', 'email', ...googleFitScopes],
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    console.log("🚀 ~ accessToken, refreshToken:", accessToken, refreshToken);
    
    try {
        // Ensure the profile has an email and displayName
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        const name = profile.displayName || 'Unknown User';
        const id = profile.id;

        if (!email) {
            return done(new Error('No email found for the user.'), null);
        }

        const user = await findOrCreateUser({ email, name, id });
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;

        done(null, user);
    } catch (error) {
        console.error('Error during user find or create:', error);
        done(error, false);
    }
}));

passport.serializeUser((user, done) => {
    console.log("🚀 ~ passport.serializeUser ~ user:", user);
    done(null, user);
});

passport.deserializeUser(async (user, done) => {
    console.log("🚀 ~ passport.deserializeUser ~ user:", user);
    
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [user.id]);
        if (result.rows.length > 0) {
            done(null, user); // Return the user object
        } else {
            done(new Error('User not found'), false);
        }
    } catch (error) {
        console.error('Error during user deserialization:', error);
        done(error, false);
    }
});

module.exports = passport;