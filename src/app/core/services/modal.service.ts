import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PrescriptionPopupComponent } from "src/app/components/prescription-popup/prescription-popup.component";
import { Prescription } from "../dtos/prescription.dto";

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    constructor(private dialog: MatDialog){}

    showPrescription(data: Prescription){
        const dialogRef = this.dialog.open(PrescriptionPopupComponent, {
            data,
            width: '750px',
            height: '600px',
            position: {
                left: '27%',
            },
            panelClass: "prescription-fiter-dialog",
        });
    }
}