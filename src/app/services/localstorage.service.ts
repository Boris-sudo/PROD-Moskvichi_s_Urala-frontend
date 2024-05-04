import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  get(key: string): string {
    if (localStorage.getItem(key) == null) {
      this.set(key, '');
      return '';
    }
    return localStorage.getItem(key)!;
  }
}
