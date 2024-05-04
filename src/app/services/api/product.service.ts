import { Injectable } from '@angular/core';
import {baseUrl} from "../../models/baseUrl";
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ProductModel} from "../../models/product.model";
import {LocalstorageService} from "../localstorage.service";

const currentUrl = `${baseUrl}/products/all`

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public mock_products: ProductModel[] = [
    {id: 0, name: 'заказать сим-карту', documents: [0,1], description: ''},
    {id: 0, name: 'заказать дебетовую карту', documents: [1,2], description: ''},
    {id: 0, name: 'получить страховку', documents: [1,3,4], description: ''},
    {id: 0, name: 'получить терминал', documents: [0,2,3], description: ''},
  ];

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
    return this.http.get(`${currentUrl}`, {headers: headers});
  }
}
