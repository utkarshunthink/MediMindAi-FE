const router = require('express').Router();
const userRoutes = require('../../routes/userRoutes');
const prescriptionRoutes = require('../../routes/prescriptionRoutes');

// Routes

// router.get("/", (req, res) => {
//     res.json({message: "You are not logged in"})
// })

// health check route for devops
router.get('/healthCheck', function (req, res) {
    res.send(200);
});


router.use(
    '/users',
    userRoutes
);

router.use(
    '/prescription',
    prescriptionRoutes
);

module.exports = router;