import { NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { PrescriptionPopupComponent } from 'src/app/components/prescription-popup/prescription-popup.component';
import { BUTTONS } from 'src/app/core/constants/buttons.constant';
import { PARAGRAPHS } from 'src/app/core/constants/paragraphs.constant';
import { TITLES } from 'src/app/core/constants/title.constant';
import { PrescriptionWithSymptoms } from 'src/app/core/dtos/prescription.dto';
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

    async fetchApi(){
        if(!this.symptoms.length) return;
        const params: Symptoms = {
            allergies: this.allergies || 'No Allergy',
            symptoms: this.symptoms.join(' & '),
            medicineType: this.medicineType
        }
        
        this.chatService.getPrescription(params).then(async (res: PrescriptionWithSymptoms)=>{
            this.modalService.showPrescription(res.data.prescriptionWithSymptoms);
            // const id = 1;
            // await this.chatService.postPrescription(res.data.prescriptionWithSymptoms, id);
            
        }).catch(err=> console.log(err));
    }
}
