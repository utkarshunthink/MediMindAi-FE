import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { BUTTONS } from "src/app/core/constants/buttons.constant";
import { PARAGRAPHS } from "src/app/core/constants/paragraphs.constant";
import { TITLES } from "src/app/core/constants/title.constant";
import { Prescription } from "src/app/core/dtos/prescription.dto";
import { DataManagementComponent } from "../data-management/data-management.component";
import { PrescriptionComponent } from "../prescription/prescription.component";

@Component({
    selector: 'app-prescription-popup',
    standalone: true,
    imports: [ CommonModule, DataManagementComponent, PrescriptionComponent ],
    templateUrl: './prescription-popup.component.html',
    styleUrls: ['./prescription-popup.component.scss'],
})
export class PrescriptionPopupComponent implements OnInit {

    public buttons = BUTTONS;
    public titles = TITLES;
    public paragraphs = PARAGRAPHS;

    constructor(@Inject(MAT_DIALOG_DATA) public prescription: Prescription, 
    private matDialogueRef: MatDialogRef<PrescriptionPopupComponent>,) {}

    ngOnInit(): void {
        console.log(this.prescription);
        // this.matDialogueRef.afterClosed();
    }
}