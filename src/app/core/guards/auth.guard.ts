import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LOCAL_STORAGE_KEYS } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor( private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)

    if (token) {
      return true; // Allow access
    } else {
      this.router.navigate(['/']); // Redirect to landing page if not authenticated
      return false; // Prevent access
    }
  }
}
