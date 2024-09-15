const express = require('express');
const router = express.Router();

const medicineController = require('../controllers/medicineController');

const authMiddleware = require('../middlewares/authMiddleware');


router.post(
    '/get-medicines', 
    // authMiddleware.isAuthenticated,
    medicineController.getMedicines
);


module.exports = router;