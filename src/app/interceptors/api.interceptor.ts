import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LOCAL_STORAGE_KEYS } from '../core/constants';
import { LocalStorageService } from '../core/services';
  
  @Injectable({
    providedIn: 'root'
  })
  export class AuthInterceptor implements HttpInterceptor {
    private readonly TOKEN_HEADER_KEY = 'Authorization';
  
    constructor(private localStorage: LocalStorageService) {
        console.log('callllin')
    }
  
    intercept(
      req: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<Object>> {
      if (this.localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)) {
        req = req.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            [this.TOKEN_HEADER_KEY]: 'Bearer ' + this.localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN),
          },
        });
      }
  
      return next.handle(req);
    }
  }