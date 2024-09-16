const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');

const startupRoutes = require('./startup/routes/startupRoutes')
const errorHandler = require('./middlewares/errorHandler');
const passport = require('./utils/passportConfig'); 

dotenv.config();

const app = express();

// Session middleware
app.use(session({
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: true
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

const corsOptions = {
    origin: '*', //configurations.pg_mt.allowedOrigins
    methods: 'GET, HEAD, PUT, OPTIONS, PATCH, POST, DELETE',
    credentials: false,  // Required for cookies, authorization headers with HTTPS
    optionsSuccessStatus: 200,
    allowedHeaders: 'Origin, Content-Type, Authorization, X-Requested-With, Accept, Access-Control-Allow-Credentials' // Adjust the list based on your needs
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json({ limit: '10mb' })); // maximum payload size set to 10MB for JSON

// Routes
app.use('/', startupRoutes);

// Global error handler
app.use(errorHandler);

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    // Consider shutting down the server or logging the error here
});

module.exports = app;