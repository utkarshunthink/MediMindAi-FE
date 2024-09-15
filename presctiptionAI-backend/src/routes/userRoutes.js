const express = require('express');
const router = express.Router();
const passport = require('passport');
const { google } = require('googleapis');
const config = require('../config/config');

const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');


// User authentication routes
router.post(
    '/register', 
    userController.register
);

router.post(
    '/login', 
    userController.login
);

router.post(
    '/forgot-password', 
    userController.forgotPassword
);

router.post(
    '/reset-password', 
    userController.resetPassword
);

router.post(
    '/reset-password', 
    userController.resetPassword
);

// Logout route
router.get('/logout', (req, res) => {
    // Logout and destroy session
    req.logout((err) => {
        if (err) { return next(err); }        
        // Destroy session if using express-session
        req.session.destroy(() => {
            // res.clearCookie('connect.sid');  // Clear the session cookie
            res.clearCookie('connect.sid', {
                path: '/', 
                httpOnly: true, 
                secure: false, // Set to true if using HTTPS
                sameSite: 'strict' // or 'lax' based on your requirements
            })
            res.status(200).json({ message: 'Logged out successfully' });
        });
    });
});

router.get('/auth/google',
    passport.authenticate('google', {
        scope: [
            ...config.googleFitScopes,
            ...config.usersScopes
        ]
    })
);

//callback from google
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/users/failed' }),
    userController.googleCallbackRedirect
);

router.get("/failed", (req, res) => {
    res.send("Failed")
});

router.get("/success", 
    authMiddleware.isAuthenticated,
    userController.sendDataTFrontend
);

// Fetch Google Fit Data
router.post('/fetch-fit-data/:numberOfDaysList',     
    authMiddleware.authenticateUser,
    userController.fetchGoogleFitData
);

router.post('/update-user-details',
    authMiddleware.authenticateUser,
    userController.updateUserDetails
);

router.post('/get-user-details',
    authMiddleware.authenticateUser,
    userController.getUserDetails
);

module.exports = router;
