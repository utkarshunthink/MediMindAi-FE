const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const startupRoutes = require('./startup/routes/startupRoutes')
const errorHandler = require('./middlewares/errorHandler');
const authenticate = require('./middlewares/authMiddleware');

const app = express();

const corsOptions = {
    origin: '*', //configurations.pg_mt.allowedOrigins
    methods: 'GET, HEAD, PUT, OPTIONS, PATCH, POST, DELETE',
    credentials: true,  // Required for cookies, authorization headers with HTTPS
    optionsSuccessStatus: 200,
    allowedHeaders: 'Origin, Content-Type, Authorization, X-Requested-With, Accept, Access-Control-Allow-Credentials' // Adjust the list based on your needs
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' })); // maximum payload size set to 10MB for JSON
// app.use(bodyParser.json());

// Routes
app.use('/', startupRoutes);

// Global error handler
app.use(errorHandler);

module.exports = app;