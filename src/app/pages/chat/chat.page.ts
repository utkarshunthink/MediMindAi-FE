import { NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { PrescriptionPopupComponent } from 'src/app/components/prescription-popup/prescription-popup.component';
import { BUTTONS } from 'src/app/core/constants/buttons.constant';
import { PARAGRAPHS } from 'src/app/core/constants/paragraphs.constant';
import { TITLES } from 'src/app/core/constants/title.constant';
import { Symptoms } from 'src/app/core/dtos/symptoms.dto';
import { ModalService } from 'src/app/core/services/modal.service';
import { ChatService } from './chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: 'chat.page.html',
  styleUrls: ['chat.page.scss'],
  standalone: true,
  imports: [FormsModule, MatDialogModule, PrescriptionPopupComponent, NgFor, NgIf, NgClass, TitleCasePipe ],
  providers: [ModalService]
})
export class ChatPage {

    public symptom: string = '';
    public symptoms: string[] = [];
    public buttons = BUTTONS;
    public titles = TITLES;
    public paragraphs = PARAGRAPHS;
    public medicineType: string = this.titles.medicineType[0];
    public allergies: string = '';
    constructor(
        private modalService: ModalService,
        private chatService: ChatService,
    ) {}

    addSymptom(){
        if(!this.symptom) return;
        this.symptoms.push(this.symptom);
        this.symptom = '';
    }

    removeSymptom(i: number){
        this.symptoms.splice(i, 1);
    }

    fetchApi(){
        if(!this.symptoms.length) return;
        const bodyReq: Symptoms = {
            allergies: this.allergies || 'No Allergy',
            symptoms: this.symptoms.join(' & '),
            medicineType: this.medicineType
        }
        const res = {
            "medicines": [
                {
                    "medicineName": "Robitussin",
                    "saltName": "Dextromethorphan",
                    "dosage": "10-20 mg every 4 hours"
                },
                {
                    "medicineName": "Mucinex",
                    "saltName": "Guaifenesin",
                    "dosage": "600 mg every 12 hours"
                }
            ],
            "symptoms": "cough",
            "precautions": [
                "Stay hydrated",
                "Rest adequately",
                "Avoid irritants like smoke"
            ],
            "numberOfDays": "7-10 days",
            "dietPlan": [
                "Consume warm soups",
                "Drink herbal teas",
                "Eat fruits rich in vitamin C"
            ],
            "homeRemedies": [
                "Honey and lemon tea",
                "Steam inhalation",
                "Saltwater gargle"
            ],
            "description": "A persistent cough that may be dry or productive, lasting for 7-10 days.",
            "currentLatLng": "28.4231603,76.8249371",
            "nearby5DoctorAccordingToMySymptom": [
                {
                    "doctorname": "Dr. Sharma",
                    "rating": "4.5",
                    "timings": "9:00 AM - 5:00 PM"
                },
                {
                    "doctorname": "Dr. Patel",
                    "rating": "4.2",
                    "timings": "10:00 AM - 6:00 PM"
                },
                {
                    "doctorname": "Dr. Gupta",
                    "rating": "4.7",
                    "timings": "8:00 AM - 4:00 PM"
                },
                {
                    "doctorname": "Dr. Singh",
                    "rating": "4.3",
                    "timings": "11:00 AM - 7:00 PM"
                },
                {
                    "doctorname": "Dr. Kumar",
                    "rating": "4.6",
                    "timings": "9:30 AM - 5:30 PM"
                }
            ]
        }
        this.modalService.showPrescription(res);
        // this.chatService.getPrescription(bodyReq).then((res: Prescription)=>{
        //     console.log(res);
        //     this.modalService.showPrescription(res);
        // }).catch(err=> console.log(err));
    }
}
