import { Injectable } from '@angular/core';
import {baseUrl} from "../../models/baseUrl";
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LocalstorageService} from "../localstorage.service";

@Injectable({
  providedIn: 'root'
})
export class OfferLocationsService {

  constructor(
    private http: HttpClient,
    private localstorage: LocalstorageService,
  ) { }

  get(): Observable<any> {
    const token = this.localstorage.get('user-token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${baseUrl}/user/locations`, {headers: headers});
  }
}
