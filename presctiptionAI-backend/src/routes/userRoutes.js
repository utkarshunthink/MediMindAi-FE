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

router.get(
    '/welcome-login', (req, res) => res.send('Please login')
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

// Logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.json({ success: true, message: 'Logged out successfully' });
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
    console.log('faifaiafa')
    res.send("Failed")
});

router.get("/success", 
    authMiddleware.isAuthenticated,
    userController.sendDataTFrontend
);

router.get("/dashboard", (req, res) => {
    console.log('faifaiafa', req.user)
    res.send(req.user)
});

// Fetch Google Fit Data
router.get('/fetch-fit-data',     
    // authMiddleware.isAuthenticated,
    authMiddleware.authenticateUser,
    userController.fetchGoogleFitData
//     (req, res) => {
//     console.log("🚀 ~ router.get ~ req:", req.user);
//     // accessToken = 'ya29.a0AcM612y-DecSSaxLNdd5CBSARPCJFOTTRG266DfGnF4_QdfAv4v2LVkmEHB7FacpX0Vjwl3bil5NCUogl09r7PoYQ32qwdyPXWha-IdnEHKi-kxfC6ZHg2MQCadpv6sFItjKlgNd1_9po8FBanS1Q73HIesEVE55UbfTSXSAaCgYKAZMSARESFQHGX2Mi1XAlhTv06dURZtcy9IFJkw0175'
//     if (!req.user || !req.user.accessToken) {
//         return res.status(401).json({ error: 'User not authenticated or missing access token' });
//     }
//     const accessT = req?.user?.accessToken || accessToken;
//     console.log("🚀 ~ accessT:", accessT);
//     const oauth2Client = new google.auth.OAuth2();
//     oauth2Client.setCredentials({ access_token: accessT });

//     const fitness = google.fitness({ version: 'v1', auth: oauth2Client });


//     // fitness.users.dataSources.list({
//     //     userId: 'me',
//     // }).then(response => {
//     //     console.log('Available Data Sources:', response.data);
//     // }).catch(error => {
//     //     console.error('Error fetching data sources:', error);
//     // });

//     const date = new Date();
//     const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTime();
//     const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59).getTime();

//     const requestBody = {
//         aggregateBy: [
//             {
//                 "dataSourceId":
//                   "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
//               },
              
//               // { dataTypeName: 'com.google.cycling.wheel_revolution.rpm' },
//             { dataTypeName: 'com.google.step_count.delta' },
//             { dataTypeName: 'com.google.active_minutes' },
//             { dataTypeName: 'com.google.activity.segment' },
//             { dataTypeName: 'com.google.hydration' },
//             { dataTypeName: 'com.google.nutrition' },
//             { dataTypeName: 'com.google.blood_glucose' },
//             { dataTypeName: 'com.google.blood_pressure' },
//             { dataTypeName: 'com.google.sleep.segment' },
//             { dataTypeName: 'com.google.heart_rate.bpm' },
//             { dataTypeName: 'com.google.calories.expended' },
//         ],
//         "bucketByTime": {
//             "durationMillis": 86400000  // 1 day in milliseconds (optional, can customize)
//           },
//         startTimeMillis: Date.now() - (7 * 24 * 60 * 60 * 1000), // 7 days ago
//         endTimeMillis: Date.now() 
//         // startTimeMillis: startOfDay,
//         // endTimeMillis: endOfDay
//     };

//     fitness.users.dataset.aggregate({
//         userId: 'me',
//         requestBody: requestBody
//     }).then(response => {
//         res.json(response.data);
//     }).catch(error => {
//         console.error('Error fetching Google Fit data:', error);
//         res.status(500).json({ error: 'Failed to fetch Google Fit data' });
//     });
// }
);



module.exports = router;
