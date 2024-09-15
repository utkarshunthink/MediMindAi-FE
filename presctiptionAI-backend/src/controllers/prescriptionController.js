const prescriptionService = require('../services/prescriptionService');
const successResponse = require('../middlewares/responseHandler');

// Controller to login user
const getPrescriptions = async (req, res, next) => {
    const { id } = req.params;
    return prescriptionService.getPrescriptions(id)
    .then((result) => successResponse(res, result, 'Prescription fetched successfully'))
    .catch((next));
};

const getUserPrescriptions = async (req, res, next) => {
    const userId = req.user?.userId;
    return prescriptionService.getUserPrescriptions(userId)
    .then((result) => successResponse(res, result, 'Users prescription fetched succesully'))
    .catch((next));
};

const savePrescriptions = async (req, res, next) => {
    const { prescription, userDetails} = req.body;
    return prescriptionService.savePrescriptions( prescription, userDetails)
    .then((result) => successResponse(res, result, 'Prescription saved successfully'))
    .catch((next));
};

const getUserPrescriptionsWithPastData = async (req, res, next) => {
    const { symptoms, allergies, medicineType } = req.query;
    const userDetails = {
        email: req.user?.email,
        name: req.user?.name,
        userId: req.user.user_id,
    }
    return prescriptionService.getUserPrescriptionsWithPastData(userDetails, symptoms, allergies, medicineType)
    .then((result) => successResponse(res, result, 'Prescription generated successfully'))
    .catch((next));
};

module.exports = {
    getPrescriptions,
    savePrescriptions,
    getUserPrescriptions,
    getUserPrescriptionsWithPastData
}