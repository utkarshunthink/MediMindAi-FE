const express = require('express');
const app = express();

const startupRoutes = require('./startup/routes/startupRoutes')
const errorHandler = require('./middlewares/errorHandler');
const authenticate = require('./middlewares/authMiddleware');

app.use(express.json());

// Routes
app.use('/', startupRoutes);

// Protected route example
app.get(
    '/protected',
    authenticate,
    userController.function
);

// Global error handler
app.use(errorHandler);

module.exports = app;