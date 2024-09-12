export interface Prescription{
    result: {
        medicines: Medicine[];
        symptoms: string;
        dosage: {
            adults: string;
        };
        precautions: string[];
        numberOfDays: string;
        dietPlan: string[];
    }
}

export interface Medicine {
    medicineName: string;
    saltName: string;
}