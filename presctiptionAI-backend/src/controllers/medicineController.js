const medicineService = require('../services/medicineService');
const successResponse = require('../middlewares/responseHandler');

// Controller to login user
const getMedicines = async (req, res, next) => {
    const { searchString, pageSize, pageNumber } = req.query;
    return medicineService.getMedicines(searchString, pageSize, pageNumber )
    .then((result) => successResponse(res, result, 'Medicines fetched successfully'))
    .catch((next));
};

module.exports = {
    getMedicines
}