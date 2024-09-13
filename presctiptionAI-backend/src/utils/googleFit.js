const { google } = require('googleapis');
const config = require('../config/config');

// Set up OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  config.googleConfig.googleClientID,
  config.googleConfig.googleClientSecret,
  config.googleConfig.callbackURL // Example: 'http://localhost:3000/oauth2callback'
);

// Scopes for Google Fit API
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

// Generate authentication URL
const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
};

// Exchange code for access token
const getToken = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

// Fetch data from Google Fit API
const fetchGoogleFitData = async () => {
  const fitness = google.fitness({ version: 'v1', auth: oauth2Client });

  const date = new Date();
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTime();
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59).getTime();

  const requestBody = {
    aggregateBy: [
      { dataTypeName: 'com.google.step_count.delta' },
      { dataTypeName: 'com.google.active_minutes' },
      { dataTypeName: 'com.google.activity.segment' },
      { dataTypeName: 'com.google.cycling.wheel_revolution.rpm' },
      { dataTypeName: 'com.google.hydration' },
      { dataTypeName: 'com.google.nutrition' },
      { dataTypeName: 'com.google.blood_glucose' },
      { dataTypeName: 'com.google.blood_pressure' },
      { dataTypeName: 'com.google.sleep.segment' },
      { dataTypeName: 'com.google.heart_rate.bpm' },
      { dataTypeName: 'com.google.calories.expended' },
    ],
    startTimeMillis: startOfDay,
    endTimeMillis: endOfDay,
  };

  const response = await fitness.users.dataset.aggregate({
    userId: 'me',
    requestBody: requestBody,
  });

  return response.data;
};

module.exports = { getAuthUrl, getToken, fetchGoogleFitData };
