import { Injectable } from '@angular/core';
import {baseUrl} from "../../models/baseUrl";
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LocalstorageService} from "../localstorage.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private localstorage: LocalstorageService,
  ) { }

  login(data:any): Observable<any> {
    return this.http.post(`${baseUrl}/login`, data);
  }

  logout(): Observable<any> {
    const token = this.localstorage.get('user-token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${baseUrl}/logout`, {}, {headers});
  }
}
