import { Injectable } from '@angular/core';
import {baseUrl} from "../../models/baseUrl";
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {OrderModel} from "../../models/order.model";
import {LocalstorageService} from "../localstorage.service";

const currentUrl = `${baseUrl}/meet`

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  public readonly mock_orders: OrderModel[] = [
    {id: 0, employer_name: 'Иван', employer_phone: '+79959247615', date: '2024-05-05', product_name: 'Сим карта', product_description: 'заказ сим-карты', address: {name: 'Москва, ул. Дубравная, д. 1', lat: 0, lon: 0}, documents: []},
    {id: 1, employer_name: 'Игорь', employer_phone: '+79959247615', date: '2024-05-05', product_name: 'Сим карта', product_description: 'заказ сим-карты', address: {name: 'Москва, ул. Дубравная, д. 2', lat: 0, lon: 0}, documents: []},
    {id: 2, employer_name: 'Владимир', employer_phone: '+79959247615', date: '2024-05-05', product_name: 'Сим карта', product_description: 'заказ сим-карты', address: {name: 'Москва, ул. Дубравная, д. 3', lat: 0, lon: 0}, documents: []},
    {id: 3, employer_name: 'Валентин', employer_phone: '+79959247615', date: '2024-05-05', product_name: 'Сим карта', product_description: 'заказ сим-карты', address: {name: 'Москва, ул. Дубравная, д. 4', lat: 0, lon: 0}, documents: []},
    {id: 4, employer_name: 'Петр', employer_phone: '+79959247615', date: '2024-05-05', product_name: 'Сим карта', product_description: 'заказ сим-карты', address: {name: 'Москва, ул. Дубравная, д. 5', lat: 0, lon: 0}, documents: []},
    {id: 5, employer_name: 'Баклажан', employer_phone: '+79959247615', date: '2024-05-05', product_name: 'Сим карта', product_description: 'заказ сим-карты', address: {name: 'Москва, ул. Дубравная, д. 6', lat: 0, lon: 0}, documents: []},
  ];

  constructor(
    private http: HttpClient,
    private localstorage: LocalstorageService,
  ) { }

  get_history(): Observable<any> {
    const token = this.localstorage.get('user-token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${currentUrl}/history`, {headers: headers});
  }

  get_active(): Observable<any> {
    const token = this.localstorage.get('user-token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${currentUrl}/active`, {headers: headers});
  }

  get_by_id(id: number): Observable<any> {
    const token = this.localstorage.get('user-token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${currentUrl}/${id}`, {headers: headers});
  }

  cancel_order(id: number): Observable<any> {
    const token = this.localstorage.get('user-token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${currentUrl}/cancel`, {id: id}, {headers});
  }

  change_order_time(id: number, time: string): Observable<any> {
    const token = this.localstorage.get('user-token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${currentUrl}/transfer`, {date: time, meet_id: id}, {headers});
  }

  rate_order(id: number, rating: number): Observable<any> {
    const token = this.localstorage.get('user-token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${currentUrl}/rate`, {rate: rating, id: id}, {headers});

  }
}
