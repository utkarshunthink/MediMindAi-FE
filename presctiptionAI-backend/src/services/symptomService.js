const symptomModel = require('../models/symptomModel');
const bcrypt = require('bcryptjs');
const jwtHelper = require('../utils/jwtHelper');
const ApiError = require('../utils/ApiError');
const crypto = require('crypto');
const moment = require('moment');

const getSymptoms = async (searchString, pageSize, pageNumber ) => {
    try {

        
        if (pageNumber < 1 || pageSize < 1) {
            throw new ApiError('Page and limit must be greater than 0', 400);
        }
        // Fetch medicines with pagination
        const symptoms = await symptomModel.getSymptoms(searchString, parseInt(pageSize, 10), parseInt(pageNumber, 10));
        console.log("🚀 ~ getSymptoms ~ symptoms:", symptoms);

        return {
            symptoms: symptoms.allSymptoms,
            totalRecords: symptoms.totalRecords,
            pageNumber,
            pageSize
        };
    } catch (error) {
        console.error("🚀 ~ getSymptoms ~ error:", error);
        throw new ApiError(error.message, error.statusCode || 500);
    }
};


module.exports = {
    getSymptoms,
};