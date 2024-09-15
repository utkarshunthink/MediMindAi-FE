const pool = require('../startup/db/pool');

const getPrescriptions = async (id) => {
    const query = 'SELECT * FROM prescriptions WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    return result.rows;
};

const getUserPrescriptions = async (userId) => {
    console.log("🚀 ~ getPrescriptions ~ userId:", userId);

    const query = 'SELECT * FROM user_prescriptions WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userId]);
    console.log("🚀 ~ getUserPrescriptions ~ result:", result.rows);

    return result.rows;
};

const prescriptionWithSymptoms = async (symptoms, allergies, medicineType) => {
    console.log("🚀 ~ getPrescriptions ~ symptoms, allergies, medicineType:", symptoms, allergies, medicineType);

    const query = `SELECT  medicines AS "medicines",
    symptoms AS "symptoms",
    precautions AS "precautions",
    diet_plan AS "dietPlan",
    home_remedies AS "homeRemedies",
    description AS "description",
    current_lat_lng AS "currentLatLng",
    nearby_doctors AS "nearby5DoctorAccordingToMySymptom",
    nearby_medical_stores AS "nearby5MedicalStore",
    created_at AS "createdAt",
    allergies AS "allergies",
    medicine_type AS "medicineType" FROM prescriptions WHERE symptoms = $1 AND allergies = $2 AND medicine_type = $3 ORDER BY created_at DESC`;

    const result = await pool.query(query, [symptoms, allergies, medicineType]);
    console.log("🚀 ~ getUserPrescriptions ~ result:", result.rows);

    return result.rows;
};

const savePrescriptions = async (prescription) => {
    console.log("🚀 ~ savePrescriptions ~ prescription", prescription);
    const {allergies, medicineType, medicines, symptoms, precautions, dietPlan, homeRemedies, description, currentLatLng, nearby5DoctorAccordingToMySymptom, nearby5MedicalStore} = prescription;
    const query = `
    INSERT INTO prescriptions (medicines, symptoms, precautions, diet_plan, home_remedies, description, current_lat_lng, nearby_doctors, nearby_medical_stores, allergies, medicine_type)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id;
    `;     
    const values = [JSON.stringify(medicines), symptoms, precautions, dietPlan, homeRemedies, description, currentLatLng, JSON.stringify(nearby5DoctorAccordingToMySymptom), JSON.stringify(nearby5MedicalStore), allergies, medicineType];

    const result = await pool.query(query, values);
    
    return result.rows[0];
};

const saveUsersPrescriptions = async (prescriptionId, userId) => {
    console.log("🚀 ~ savePrescriptions ~ prescriptionId, userId");
    const query = `
    INSERT INTO user_prescriptions (prescription_id, user_id, created_at)
    VALUES ($1, $2, NOW()) RETURNING *;
    `;     

    const result = await pool.query(query, [prescriptionId, userId]);
    
    return result.rows[0];
};

module.exports = {
    getPrescriptions,
    savePrescriptions,
    saveUsersPrescriptions,
    getUserPrescriptions,
    prescriptionWithSymptoms
};
