import { NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BUTTONS } from 'src/app/core/constants/buttons.constant';
import { Prescription } from 'src/app/core/interfaces/prescription.interface';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.page.html',
  styleUrls: ['chat.page.scss'],
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, NgClass, TitleCasePipe],
})
export class ChatPage {

    public symptom: string = '';
    public symptoms: string[] = [];
    public prescription: Prescription| null = null;
    public buttons = BUTTONS;
    constructor(
        private chatService: ChatService
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
        const params = this.symptoms.join(' & ');
        this.chatService.getPrescription(params).then((res: Prescription)=>{
            console.log(res);
            this.prescription = res;
        }).catch(err=> console.log(err));
    }
}
