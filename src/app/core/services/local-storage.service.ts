import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  private setItem<T>(key: string, value: T) {
    const stringifiedValue = JSON.stringify(value);
    localStorage.setItem(key, stringifiedValue);
  }

  private getItem<T>(key: string) {
    const localValue = localStorage.getItem(key);
    if (localValue) {
      const parsedValue: T = JSON.parse(localValue);
      return parsedValue;
    } else {
      return null;
    }
  }

  private deleteItem(key: string) {
    localStorage.removeItem(key);
  }
}
