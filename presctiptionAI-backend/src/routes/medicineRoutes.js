const express = require('express');
const router = express.Router();

const medicineController = require('../controllers/medicineController');

const authMiddleware = require('../middlewares/authMiddleware');


router.get(
    '/get-medicines', 
    // authMiddleware.isAuthenticated,
    medicineController.getMedicines
);


module.exports = router;