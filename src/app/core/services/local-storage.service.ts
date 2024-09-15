import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  setItem<T>(key: string, value: T) {
    const stringifiedValue = JSON.stringify(value);
    localStorage.setItem(key, stringifiedValue);
  }

  getItem<T>(key: string) {
    const localValue = localStorage.getItem(key);
    if (localValue) {
      const parsedValue: T = JSON.parse(localValue);
      return parsedValue;
    } else {
      return null;
    }
  }

  deleteItem(key: string) {
    localStorage.removeItem(key);
  }
}
