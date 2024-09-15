export interface Prescription{
    medicines: Medicine[];
    symptoms: string;
    precautions: string[];
    dietPlan: string[];
    homeRemedies: string[];
    description: string;
    currentLatLng: string;
    nearby5DoctorAccordingToMySymptom: Doctors[];
    nearby5MedicalStore: MedicalStores[];
    allergies: string;
    medicineType: string;
}

export interface PrescriptionWithSymptoms{
    success: boolean;
    message: string;
    data: {
        prescriptionWithSymptoms: Prescription;
    }
}

export interface PreviousPrescription{
    success: boolean;
    message: string;
    data: {
        userPrescription: PreviousPrescriptionData[];
    }
}

export interface PreviousPrescriptionData{
    allergies: string;
    created_at: string;
    medicine_type: string;
    prescription_id: number
    symptoms: string
    user_id: number
}

export interface Medicine{
    medicineName: string;
    saltName: string;
    dosage: string;
    description: string;
    numberOfDays: string;
}

export interface Doctors{
    doctorName: string,
    rating: string,
    timings: string
}

export interface MedicalStores{
    medicalName: string;
    rating: string;
    timings: string;
}