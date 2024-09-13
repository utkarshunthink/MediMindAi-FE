const express = require('express');
const router = express.Router();

// const prescriptionController = require('../controllers/prescriptionController');


router.get(
    '/',
    //authenticate middleware
    (req, res) => {
        res.json({message: "You are logged in"})
    }
);

module.exports = router;