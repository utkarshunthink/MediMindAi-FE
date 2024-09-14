import { Injectable } from "@angular/core";
import { Symptoms } from "src/app/core/dtos/symptoms.dto";
import { HttpService } from "src/app/core/services";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ChatService{
    constructor(
        private httpService: HttpService){}

    getPrescription(bodyReq: Symptoms): Promise<any>{
        return this.httpService.post(environment.apiBaseUrl+'gen-medicine',bodyReq);
    }
}