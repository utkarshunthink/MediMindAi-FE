const router = require('express').Router();
const userRoutes = require('../../routes/userRoutes');

// Routes

// health check route for devops
router.get('/healthCheck', function (req, res) {
    res.send(200);
});


router.use(
    '/users',
    userRoutes
);
