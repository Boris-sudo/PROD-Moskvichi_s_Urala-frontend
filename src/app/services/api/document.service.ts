import { Injectable } from '@angular/core';
import {baseUrl} from "../../models/baseUrl";
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DocumentModel} from "../../models/document.model";
import {LocalstorageService} from "../localstorage.service";

const currentUrl = `${baseUrl}/meet/all_documents`;

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  public mock_documents: DocumentModel[] = [
    {id: 0, name: 'паспорт', live_time: '', description: ''},
    {id: 1, name: 'справка из школы', live_time: '', description: ''},
    {id: 2, name: 'полис', live_time: '', description: ''},
    {id: 3, name: 'свидетельство о рождении', live_time: '', description: ''},
    {id: 4, name: 'СНИЛС', live_time: '', description: ''},
  ]

  constructor(
    private http: HttpClient,
    private localstorage: LocalstorageService
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
