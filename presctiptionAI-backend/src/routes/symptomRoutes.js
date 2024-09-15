const express = require('express');
const router = express.Router();

const symptomController = require('../controllers/symptomController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post(
    '/get-symptoms', 
    authMiddleware.authenticateUser,
    symptomController.getSymptoms
);

module.exports = router;