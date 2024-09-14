export interface Prescription{
    medicines: Medicine[];
    symptoms: string;
    precautions: string[];
    dietPlan: string[];
    homeRemedies: string[];
    description: string;
    currentLatLng: string;
    nearby5DoctorAccordingToMySymptom: Doctors[];
}

export interface Medicine{
    medicineName: string;
    saltName: string;
    dosage: string;
    description: string;
    numberOfDays: string;
}

export interface Doctors{
    doctorname: string,
    rating: string,
    timings: string
}