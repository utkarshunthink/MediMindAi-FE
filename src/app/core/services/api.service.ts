import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { API_CONSTANTS } from '../constants/api.constant';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = environment.apiBaseUrl;

  constructor(private httpService: HttpService) {}

  logout(){
    return this.httpService.get(this.baseUrl+API_CONSTANTS.logout);
  }

  getPreviousPrescription(userId: number): Promise<any>{
    return this.httpService.post(environment.apiBaseUrl+`prescription/get-user-prescription?userId=${userId}`, {});
  }
}
