const express = require('express');
const router = express.Router();
const passport = require('passport');
const { google } = require('googleapis');

const userController = require('../controllers/userController');

const authMiddleware = require('../middlewares/authMiddleware');
const { getAuthUrl, getToken, fetchGoogleFitData } = require('../utils/googleFit');

const scopes = [
    'https://www.googleapis.com/auth/fitness.activity.read',
    'https://www.googleapis.com/auth/fitness.heart_rate.read',
    'https://www.googleapis.com/auth/fitness.location.read',
    'https://www.googleapis.com/auth/fitness.blood_glucose.read',
    'https://www.googleapis.com/auth/fitness.blood_pressure.read',
    'https://www.googleapis.com/auth/fitness.body.read',
    'https://www.googleapis.com/auth/fitness.body_temperature.read',
    'https://www.googleapis.com/auth/fitness.nutrition.read',
    'https://www.googleapis.com/auth/fitness.oxygen_saturation.read',
    'https://www.googleapis.com/auth/fitness.sleep.read',
  ];

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

// google login page
router.get('/auth/google',
    // const url = getAuthUrl();
//     res.redirect(url);
    // authMiddleware.isAuthenticated,
    passport.authenticate('google', { scope: ['profile', 'email', ...scopes] })
);

//callback from google
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/users/failed' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/users/success');
    }
);

router.get("/failed", (req, res) => {
    console.log('faifaiafa')
    res.send("Failed")
});

router.get("/success", 
    authMiddleware.isAuthenticated,
    (req, res) => {
        // console.log(req, 'rererer');
        // console.log(req.user, 'rererer')

    res.send(`Welcome ${req}`)
});



// // Step 1: Redirect to Google for login
// router.get('/auth/google', (req, res) => {
//     const url = getAuthUrl();
//     res.redirect(url);
//   });
  
//   // Step 2: Google will redirect back with code after authentication
//   router.get('/oauth2callback', async (req, res) => {
//     const { code } = req.query;
//     if (!code) {
//       return res.status(400).send('No code provided');
//     }
  
//     try {
//       const tokens = await getToken(code);
//       res.json(tokens); // Store the tokens securely (e.g., session or database)
//     } catch (error) {
//       console.error('Error exchanging code for tokens:', error);
//       res.status(500).send('Authentication failed');
//     }
//   });
  
  // Fetch data from Google Fit API
//   router.get('/fetch-fit-data', async (req, res) => {
//     try {
//       const data = await fetchGoogleFitData();
//       res.json(data);
//     } catch (error) {
//       console.error('Error fetching Google Fit data:', error);
//       res.status(500).send('Error fetching Google Fit data');
//     }
//   });

// Fetch Google Fit Data
router.get('/fetch-fit-data',     
    // authMiddleware.isAuthenticated,
    (req, res) => {
    console.log("🚀 ~ router.get ~ req:", req.user);
    accessToken = 'ya29.a0AcM612y-DecSSaxLNdd5CBSARPCJFOTTRG266DfGnF4_QdfAv4v2LVkmEHB7FacpX0Vjwl3bil5NCUogl09r7PoYQ32qwdyPXWha-IdnEHKi-kxfC6ZHg2MQCadpv6sFItjKlgNd1_9po8FBanS1Q73HIesEVE55UbfTSXSAaCgYKAZMSARESFQHGX2Mi1XAlhTv06dURZtcy9IFJkw0175'
    if (!req.user || !req.user.accessToken) {
        return res.status(401).json({ error: 'User not authenticated or missing access token' });
    }
    const accessT = req?.user?.accessToken || accessToken;
    console.log("🚀 ~ accessT:", accessT);
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessT });

    const fitness = google.fitness({ version: 'v1', auth: oauth2Client });


fitness.users.dataSources.list({
    userId: 'me',
  }).then(response => {
    console.log('Available Data Sources:', response.data);
  }).catch(error => {
    console.error('Error fetching data sources:', error);
  });

    const date = new Date();
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTime();
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59).getTime();

    const requestBody = {
        aggregateBy: [
            {
                "dataSourceId":
                  "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
              },
              
              // { dataTypeName: 'com.google.cycling.wheel_revolution.rpm' },
            { dataTypeName: 'com.google.step_count.delta' },
            { dataTypeName: 'com.google.active_minutes' },
            { dataTypeName: 'com.google.activity.segment' },
            { dataTypeName: 'com.google.hydration' },
            { dataTypeName: 'com.google.nutrition' },
            { dataTypeName: 'com.google.blood_glucose' },
            { dataTypeName: 'com.google.blood_pressure' },
            { dataTypeName: 'com.google.sleep.segment' },
            { dataTypeName: 'com.google.heart_rate.bpm' },
            { dataTypeName: 'com.google.calories.expended' },
        ],
        "bucketByTime": {
            "durationMillis": 86400000  // 1 day in milliseconds (optional, can customize)
          },
        startTimeMillis: Date.now() - (7 * 24 * 60 * 60 * 1000), // 7 days ago
        endTimeMillis: Date.now() 
        // startTimeMillis: startOfDay,
        // endTimeMillis: endOfDay
    };

    fitness.users.dataset.aggregate({
        userId: 'me',
        requestBody: requestBody
    }).then(response => {
        res.json(response.data);
    }).catch(error => {
        console.error('Error fetching Google Fit data:', error);
        res.status(500).json({ error: 'Failed to fetch Google Fit data' });
    });
});



module.exports = router;
