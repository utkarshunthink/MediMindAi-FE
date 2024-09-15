import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LoaderService, LocalStorageService } from '.';
import { LOCAL_STORAGE_KEYS } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private http: HttpClient,
    // private toastService: ToastService,
    private loaderService: LoaderService,
    private localStorage: LocalStorageService,
    private router: Router
  ) {
    
  }

  createHeaders() {
    let headers = new HttpHeaders();
    headers = headers.set('content-type', 'application/json; charset=UTF-8');
    headers = headers.set('Authorization', 'Bearer ' + this.localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN));
    return headers;
  }


  async get<ResponseDto>(
    url: string,
    queryParams?: HttpParams | { [param: string]: string | number | boolean }
  ) {
    this.loaderService.showLoader();
    try {
      const response = await firstValueFrom(
        this.http.get<ResponseDto>(url, {
          params: queryParams,
          headers: this.createHeaders(),
        })
      );
      this.loaderService.dismissLoader();
      return response;
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async post<RequestDto, ResponseDto>(
    url: string,
    body: RequestDto,
    queryParams?: HttpParams | { [param: string]: string | number | boolean }
  ) {
    this.loaderService.showLoader();
    try {
      const response = await firstValueFrom(
        this.http.post<ResponseDto>(url, body, {
          params: queryParams,
          headers: this.createHeaders(),
        })
      );
      this.loaderService.dismissLoader();
      return response;
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async put<RequestDto, ResponseDto>(
    url: string,
    body: RequestDto,
    queryParams?: HttpParams | { [param: string]: string | number | boolean }
  ) {
    this.loaderService.showLoader();
    try {
      const response = await firstValueFrom(
        this.http.put<ResponseDto>(url, body, {
          params: queryParams,
          headers: this.createHeaders(),
        })
      );
      this.loaderService.dismissLoader();
      return response;
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async delete<ResponseDto>(
    url: string,
    queryParams?: HttpParams | { [param: string]: string | number | boolean }
  ) {
    this.loaderService.showLoader();
    try {
      const response = await firstValueFrom(
        this.http.delete<ResponseDto>(url, {
          params: queryParams,
          headers: this.createHeaders(),
        })
      );
      this.loaderService.dismissLoader();
      return response;
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getFile(
    url: string,
    queryParams?: HttpParams | { [param: string]: string | number | boolean }
  ) {
    this.loaderService.showLoader();
    try {
      const response = await firstValueFrom(
        this.http.get(url, {
          params: queryParams,
          responseType: 'blob',
          headers: this.createHeaders(),
        })
      );
      this.loaderService.dismissLoader();
      return response;
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  handleApiError(error: unknown) {
    this.loaderService.dismissLoader();
    if (error instanceof HttpErrorResponse && error.status === 401) {
      this.handle401Error();
    } else {
      // this.toastService.displayErrorToast(
      //   (error as HttpErrorResponse)?.error?.message
      // );
    }
    return null;
  }

  private handle401Error() {
    this.localStorage.deleteItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    this.router.navigate(['']);
    // this.toastService.displayErrorToast('ERROR.SESSION_EXPIRED');
  }
}
