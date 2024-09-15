const express = require('express');
const router = express.Router();

const prescriptionController = require('../controllers/prescriptionController')

const authMiddleware = require('../middlewares/authMiddleware');


router.get(
    '/get-prescription/:id', 
    // authMiddleware.isAuthenticated,
    prescriptionController.getPrescriptions
);

router.post(
    '/store', 
    // authMiddleware.isAuthenticated,
    prescriptionController.savePrescriptions
);

router.post(
    '/get-user-prescription', 
    // authMiddleware.isAuthenticated,
    prescriptionController.getUserPrescriptions
);

router.post(
    '/get-user-prescription-with-past-symptoms', 
    // authMiddleware.isAuthenticated,
    prescriptionController.getUserPrescriptionsWithPastData
);


module.exports = router;