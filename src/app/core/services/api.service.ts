import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = environment.apiBaseUrl;

  constructor(private httpService: HttpService) {}

  signInWithGoogle() {
    return this.httpService.get(`${this.baseUrl}users/auth/google`);
  }
}
