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

  getPreviousPrescription(): Promise<any>{
    return this.httpService.post(this.baseUrl+`prescription/get-user-prescription`, {});
  }

  searchMedicines(searchString: string, pageSize: number, pageNumber: number){
    return this.httpService.post(this.baseUrl+`medicines/get-medicines?searchString=${searchString}&pageSize=${pageSize}&pageNumber=${pageNumber}`, {});
  }

  getGoogleFit(params: string){
    return this.httpService.post(this.baseUrl+`users/fetch-fit-data/${params}`, {});
  }

  getProfileData() {
    return this.httpService.post(this.baseUrl+`users/get-user-details`, {});
  }

  updateProfileData(userDetails: any) {
    return this.httpService.post(this.baseUrl+`users/update-user-details`, userDetails);
  }
}
