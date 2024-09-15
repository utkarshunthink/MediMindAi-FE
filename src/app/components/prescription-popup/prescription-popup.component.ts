import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { BUTTONS } from "src/app/core/constants/buttons.constant";
import { PARAGRAPHS } from "src/app/core/constants/paragraphs.constant";
import { TITLES } from "src/app/core/constants/title.constant";
import { Prescription } from "src/app/core/dtos/prescription.dto";
import { DataManagementComponent } from "../data-management/data-management.component";
import { PrescriptionComponent } from "../prescription/prescription.component";
import { IMAGES } from "src/app/core/constants/images.constant";

@Component({
    selector: 'app-prescription-popup',
    standalone: true,
    imports: [ CommonModule, DataManagementComponent, PrescriptionComponent ],
    templateUrl: './prescription-popup.component.html',
    styleUrls: ['./prescription-popup.component.scss'],
})

  export class PrescriptionPopupComponent implements OnInit {
    private synth: SpeechSynthesis;
    private utterance: SpeechSynthesisUtterance | null = null;
    public isSpeaking: boolean = false;
    prompt!:string;
    public buttons = BUTTONS;
    public titles = TITLES;
    public paragraphs = PARAGRAPHS;
    public images = IMAGES;

    constructor(@Inject(MAT_DIALOG_DATA) public prescription: Prescription,
                private matDialogueRef: MatDialogRef<PrescriptionPopupComponent>,) {
      this.synth = window.speechSynthesis;
    }

    ngOnInit(): void {
      console.log(this.prescription);
      this.prompt= this.createSpeechPrompt(this.prescription);
      this.speak(this.prompt);
    }

    createSpeechPrompt(prescription: Prescription): string {
      return `
Hello Prince, I am your Medimix assistant. Based on your input, are the details regarding prescription.
You have prescribed medication to address the following condition: ${prescription.description}. You may be experiencing symptoms such as ${prescription.symptoms}.
To support your recovery, it is important to follow a specific diet plan, which includes ${prescription.dietPlan.join(', ')}. Additionally, you can consider some effective home remedies such as ${prescription.homeRemedies.join(', ')}.
Please remember to take necessary precautions, which include ${prescription.precautions.join(', ')}.

If you need further assistance, here are some nearby doctors who can help you according to your symptoms: ${prescription.nearby5DoctorAccordingToMySymptom.map((doctor: any) => doctor.name).join(', ')}.
      `;
    }

    speak(text: string): void {
      if (this.synth) {
        this.utterance = new SpeechSynthesisUtterance(text);
        this.utterance.onend = () => {
          console.log('Speech has finished');
          this.isSpeaking = false;
        };
        this.utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
        };
        this.synth.speak(this.utterance);
        this.isSpeaking = true;
      }
    }

    pauseSpeech(): void {
      if (this.synth && this.isSpeaking) {
        this.synth.cancel();
        this.isSpeaking = false;
      }
    }

    resumeSpeech(): void {
      if (this.synth && !this.isSpeaking) {
        this.synth.resume();
        this.isSpeaking = true;
      }
    }
  }
