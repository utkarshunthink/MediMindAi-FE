import { Injectable } from "@angular/core";
import { HttpService } from "src/app/core/services";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ChatService{
    constructor(private httpService: HttpService){}

    getPrescription(symptoms: string): Promise<any>{
        return this.httpService.get(environment.apiBaseUrl+'get/'+ symptoms);
    }
}