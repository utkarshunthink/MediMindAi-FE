const symptomService = require('../services/symptomService');
const successResponse = require('../middlewares/responseHandler');

// Controller to login user
const getSymptoms = async (req, res, next) => {
    const { searchString, pageSize, pageNumber } = req.query;
    return symptomService.getSymptoms(searchString, pageSize, pageNumber )
    .then((result) => successResponse(res, result, 'Symptoms fetched successfully'))
    .catch((next));
};

module.exports = {
    getSymptoms
}