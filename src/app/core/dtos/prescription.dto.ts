export interface Prescription{
    medicines: Medicine[];
    symptoms: string;
    precautions: string[];
    numberOfDays: string;
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
}

export interface Doctors{
    doctorname: string,
    rating: string,
    timings: string
}