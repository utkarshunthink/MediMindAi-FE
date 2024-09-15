const express = require('express');
const router = express.Router();

const prescriptionController = require('../controllers/prescriptionController')
const authMiddleware = require('../middlewares/authMiddleware');

router.post(
    '/get-prescription/:id', 
    authMiddleware.authenticateUser,
    prescriptionController.getPrescriptions
);

router.post(
    '/store', 
    authMiddleware.authenticateUser,
    prescriptionController.savePrescriptions
);

router.post(
    '/get-user-prescription', 
    authMiddleware.authenticateUser,
    prescriptionController.getUserPrescriptions
);

router.post(
    '/get-user-prescription-with-past-symptoms', 
    authMiddleware.authenticateUser,
    prescriptionController.getUserPrescriptionsWithPastData
);

module.exports = router;