import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  displayToast(toastMessage: string, type: 'success' | 'warning' | 'error') {
    this.snackBar.open(toastMessage, undefined, {
      duration: 3000,
      panelClass: [type],
    });
  }

  displayErrorToast(message?: string) {
    this.displayToast(message || 'An unknown error has occured', 'error');
  }

  displaySuccessToast(message: string) {
    this.displayToast(message, 'success');
  }
}
