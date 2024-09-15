const symptomModel = require('../models/symptomModel');

const getSymptoms = async (searchString, pageSize, pageNumber ) => {
    try {
        if (pageNumber < 1 || pageSize < 1) {
            throw new ApiError('Page and limit must be greater than 0', 400);
        }
        // Fetch symptoms with pagination
        const symptoms = await symptomModel.getSymptoms(searchString, parseInt(pageSize, 10), parseInt(pageNumber, 10));

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