const prescriptionModel = require('../models/prescriptionModel');
const bcrypt = require('bcryptjs');
const jwtHelper = require('../utils/jwtHelper');
const ApiError = require('../utils/ApiError');
const crypto = require('crypto');
const moment = require('moment');
const config = require('../config/config');
const Anthropic = require('@anthropic-ai/sdk');
const emailService = require('../utils/emailConfig');

const getPrescriptions = async (id ) => {
    try {        
        // Fetch medicines with pagination
        const prescription = await prescriptionModel.getPrescriptions(id);

        return {
            prescription
        };
    } catch (error) {
        console.error("🚀 ~ fetchMedicines ~ error:", error);
        throw new ApiError(error.message, error.statusCode || 500);
    }
};

const getUserPrescriptionsWithPastData = async (userDetails, symptoms, allergies, medicineType ) => {
    console.log("🚀 ~ getUserPrescriptionsWithPastData ~ userDetails, symptoms, allergies, medicineType:", userDetails, symptoms, allergies, medicineType);
    try {        
        // Fetch medicines with pagination
        const prescriptionWithSymptoms = await prescriptionModel.prescriptionWithSymptoms(symptoms, allergies, medicineType);
        console.log("🚀 ~ getUserPrescriptionsWithPastData ~ prescriptionWithSymptoms:", prescriptionWithSymptoms.length);

        if(prescriptionWithSymptoms.length > 0){
            emailService.sendEmail(userDetails, prescriptionWithSymptoms);
            return {
                prescriptionWithSymptoms: prescriptionWithSymptoms[0]
            };
        }

        //call claude api
        const newPrescriptions = await getPrescriptionWithClaudeAI(symptoms, allergies, medicineType);
        console.log("🚀 ~ getUserPrescriptionsWithPastData ~ newPrescriptions:", newPrescriptions);
        prescriptionModel.savePrescriptions(newPrescriptions);
        console.log(userDetails, 'aaa');
        
        emailService.sendEmail(userDetails, newPrescriptions);

        return {
            prescriptionWithSymptoms: newPrescriptions
        }

    } catch (error) {
        console.error("🚀 ~ fetchMedicines ~ error:", error);
        throw new ApiError(error.message, error.statusCode || 500);
    }
};

const getUserPrescriptions = async (userId) => {
    try {        
        // Fetch medicines with pagination
        const userPrescription = await prescriptionModel.getUserPrescriptions(userId);

        return {
            userPrescription
        };
    } catch (error) {
        console.error("🚀 ~ fetchMedicines ~ error:", error);
        throw new ApiError(error.message, error.statusCode || 500);
    }
};

const savePrescriptions = async (prescription, userDetails ) => {
    try {        
        // Fetch medicines with pagination
        const prescriptionResult =  await prescriptionModel.savePrescriptions(prescription);
        await prescriptionModel.saveUsersPrescriptions(prescriptionResult.id, userDetails.id);
        return {prescriptionId: prescriptionResult.id };

    } catch (error) {
        console.error("🚀 ~ fetchMedicines ~ error:", error);
        throw new ApiError(error.message, error.statusCode || 500);
    }
};

const getPrescriptionWithClaudeAI = async (symtoms, allergies, medicineType) => {

    const prompt = getPrompt(symtoms, allergies, medicineType)

    const anthropic = new Anthropic({
        apiKey: config.claudeAPIKey, // defaults to process.env["ANTHROPIC_API_KEY"]
    });

    const msg = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
    });
    console.log("🚀 ~ getPrescriptionWithClaudeAI ~ msg:", msg);
    
    return JSON.parse(msg.content[0].text);
}

const getPrompt = (symptoms, allergies, medicineType) =>  {
    return `context: I want to fill this object based on given symptoms, allergies & medicineType. Please provide the response in strict JSON format so that I can directly use JSON.stringify and JSON.parse to convert it into an object. The object should follow this structure:
    {
      "medicines":[ { medicineName: "", saltName: "", dosage: "", description: "", numberOfDays: "" }, ...],
      "symptoms":${symptoms},
      "allergies":${allergies},
      "medicineType":${medicineType},
      "precautions":["", "", ...],
      "dietPlan":["", ...],
      "homeRemedies":["", ...],
      "description":"",
      "currentLatLng":"28.4231603,76.8249371",
      "nearby5DoctorAccordingToMySymptom":[{doctorName: "", rating: "", timings: ""}]
      "nearby5MedicalStore":[{medicalName: "", rating: "", timings: ""}]
    }
    ** Use allergies:${allergies} to avoid those medicines which will impact to patient
    ** Give medicines names on the basis of ${medicineType}
    Note: No need for explanations, backticks, or any extra text. Only return valid JSON data.`
    

}


module.exports = {
    getPrescriptions,
    savePrescriptions,
    getUserPrescriptions,
    getUserPrescriptionsWithPastData,
    getPrescriptionWithClaudeAI
};