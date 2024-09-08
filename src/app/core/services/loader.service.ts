import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  loaderCount = 0;
  isLoading = new BehaviorSubject(false);

  constructor() {}

  showLoader() {
    this.isLoading.next(true);
    this.loaderCount++;
  }

  dismissLoader() {
    this.loaderCount--;
    if (this.isLoading && this.loaderCount <= 0) {
      this.isLoading.next(false);
    }
  }
}
