const prescriptionModel = require('../models/prescriptionModel');
const bcrypt = require('bcryptjs');
const jwtHelper = require('../utils/jwtHelper');
const ApiError = require('../utils/ApiError');
const crypto = require('crypto');
const moment = require('moment');

const getPrescriptions = async (searchString, pageSize, pageNumber ) => {
    try {

        
        if (pageNumber < 1 || pageSize < 1) {
            throw new ApiError('Page and limit must be greater than 0', 400);
        }
        // Fetch medicines with pagination
        const medicines = await prescriptionModel.getPrescriptions(searchString, parseInt(pageSize, 10), parseInt(pageNumber, 10));
        console.log("🚀 ~ getPrescription ~ medicines:", medicines);

        return {
            medicines: medicines.allMedicines,
            totalRecords: medicines.totalRecords,
            pageNumber,
            pageSize
        };
    } catch (error) {
        console.error("🚀 ~ fetchMedicines ~ error:", error);
        throw new ApiError(error.message, error.statusCode || 500);
    }
};


module.exports = {
    getPrescriptions,
};