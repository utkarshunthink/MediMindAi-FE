const prescriptionService = require('../services/prescriptionService');
const successResponse = require('../middlewares/responseHandler');

// Controller to login user
const getPrescriptions = async (req, res, next) => {
    const { id } = req.params;
    console.log("🚀 ~ getPrescriptions ~ id:", id);
    return prescriptionService.getPrescriptions(id )
    .then((result) => successResponse(res, result, 'User logged in successfully'))
    .catch((next));
};

const getUserPrescriptions = async (req, res, next) => {
    const { userId } = req.query;
    console.log("🚀 ~ getPrescriptions ~ id:", userId);
    return prescriptionService.getUserPrescriptions(userId)
    .then((result) => successResponse(res, result, 'User logged in successfully'))
    .catch((next));
};

const savePrescriptions = async (req, res, next) => {
    const { prescription, userDetails} = req.body;
    return prescriptionService.savePrescriptions( prescription, userDetails)
    .then((result) => successResponse(res, result, 'User logged in successfully'))
    .catch((next));
};


const getUserPrescriptionsWithPastData = async (req, res, next) => {
    const { symptoms, allergies, medicineType } = req.query;
    console.log("🚀 ~ getPrescriptions ~ symtoms, allergies, medicineType:", symptoms, allergies, medicineType);
    return prescriptionService.getUserPrescriptionsWithPastData(symptoms, allergies, medicineType)
    .then((result) => successResponse(res, result, 'User logged in successfully'))
    .catch((next));
};

module.exports = {
    getPrescriptions,
    savePrescriptions,
    getUserPrescriptions,
    getUserPrescriptionsWithPastData
}