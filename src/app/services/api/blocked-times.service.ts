import { Injectable } from '@angular/core';
import {baseUrl} from "../../models/baseUrl";
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LocalstorageService} from "../localstorage.service";

const currentUrl = `${baseUrl}/user/available_times`;

@Injectable({
  providedIn: 'root'
})
export class BlockedTimesService {

  constructor(
    private http: HttpClient,
    private localstorage: LocalstorageService,
  ) { }

  submitMeeting(lon: number, lat: number, productId: number, date: string, agent: string | null): Observable<any> {
    const token = this.localstorage.get('user-token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    let body;
    if (agent == null) {
      body = {lon: lon, lat: lat, date: date, product_id: productId};
    } else {
      body = {lon: lon, lat: lat, product_id: productId, date: date, agent: agent};
    }
    return this.http.post<any>(`${baseUrl}/meet/create`, body, {headers});
  }

  checkLocation(lon: number, lat: number, prodId: number): Observable<any> {
    const token = this.localstorage.get('user-token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${baseUrl}/locations/check?lon=${lon}&lat=${lat}&product_id=${prodId}`, {headers: headers});
  }

  getAvailableTimes(employers: any): Observable<any> {
    const token = this.localstorage.get('user-token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    let newEmployers = JSON.stringify(employers);
    return this.http.get(`${currentUrl}?employers=${newEmployers}`, {headers: headers});
  }
}
