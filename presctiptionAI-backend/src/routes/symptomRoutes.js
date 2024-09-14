const express = require('express');
const router = express.Router();

const symptomController = require('../controllers/symptomController');

const authMiddleware = require('../middlewares/authMiddleware');


router.get(
    '/get-symptoms', 
    // authMiddleware.isAuthenticated,
    symptomController.getSymptoms
);


module.exports = router;