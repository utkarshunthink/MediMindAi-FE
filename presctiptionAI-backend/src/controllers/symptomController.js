const symptomService = require('../services/symptomService');
const successResponse = require('../middlewares/responseHandler');

// Controller to login user
const getSymptoms = async (req, res, next) => {
    const { searchString, pageSize, pageNumber } = req.query;
    console.log("🚀 ~ getSymptoms ~ searchString, pageSize, pageNumber:", searchString, pageSize, pageNumber);
    return symptomService.getSymptoms(searchString, pageSize, pageNumber )
    .then((result) => successResponse(res, result, 'User logged in successfully'))
    .catch((next));
};

module.exports = {
    getSymptoms
}