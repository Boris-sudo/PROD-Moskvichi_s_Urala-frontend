import { Injectable } from '@angular/core';
import {baseUrl} from "../../models/baseUrl";
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LocalstorageService} from "../localstorage.service";

const currentUrl = `${baseUrl}/profile`

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private localstorage: LocalstorageService,
    private http: HttpClient,
  ) { }

  get(): Observable<any> {
    const token = this.localstorage.get('user-token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${currentUrl}`, {headers: headers});
  }
}
