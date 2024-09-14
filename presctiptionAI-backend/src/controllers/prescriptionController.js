const prescriptionService = require('../services/prescriptionService');
const successResponse = require('../middlewares/responseHandler');

// Controller to login user
const getPrescriptions = async (req, res, next) => {
    console.log('ggg')
    const { searchString, pageSize, pageNumber } = req.query;
    console.log("🚀 ~ getMedicines ~ searchString, pageSize, pageNumber:", searchString, pageSize, pageNumber);
    return prescriptionService.getPrescriptions(searchString, pageSize, pageNumber )
    .then((result) => successResponse(res, result, 'User logged in successfully'))
    .catch((next));
};

module.exports = {
    getPrescriptions
}