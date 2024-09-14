const router = require('express').Router();
const userRoutes = require('../../routes/userRoutes');
const medicineRoutes = require('../../routes/medicineRoutes');
const symptomRoutes = require('../../routes/symptomRoutes');

const prescriptionRoutes = require('../../routes/prescriptionRoutes');

// Routes
// health check route for devops
router.get('/healthCheck', function (req, res) {
    res.send(200);
});

router.use(
    '/users',
    userRoutes
);

router.use(
    '/medicines',
    medicineRoutes
);

router.use(
    '/symptoms',
    symptomRoutes
);

router.use(
    '/prescription',
    prescriptionRoutes
);

module.exports = router;