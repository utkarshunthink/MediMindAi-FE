const express = require('express');
const router = express.Router();
const passport = require('passport');
const { google } = require('googleapis');

const prescriptionController = require('../controllers/prescriptionController')

const authMiddleware = require('../middlewares/authMiddleware');


router.get(
    '/get-prescriptions', 
    // authMiddleware.isAuthenticated,
    prescriptionController.getPrescriptions
);


module.exports = router;