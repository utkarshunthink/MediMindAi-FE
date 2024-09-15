import { Injectable } from "@angular/core";
import { Prescription } from "src/app/core/dtos/prescription.dto";
import { Symptoms } from "src/app/core/dtos/symptoms.dto";
import { HttpService } from "src/app/core/services";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ChatService{
    constructor(private httpService: HttpService){}

    getPrescription(params: Symptoms): Promise<any>{
        return this.httpService.post(environment.apiBaseUrl+`prescription/get-user-prescription-with-past-symptoms?allergies=${params.allergies}&symptoms=${params.symptoms}&medicineType=${params.medicineType}`, {});
    }

    postPrescription(bodyReq: Prescription, id: number){
        return this.httpService.post(environment.apiBaseUrl+'prescription/store', {prescription: bodyReq, userDetails: {id}});
    }
}