import {Component, OnInit} from '@angular/core';
import {LocalstorageService} from "../../services/localstorage.service";
import {RoutingService} from "../../services/routing.service";
import {OrderModel} from "../../models/order.model";
import {OrdersService} from "../../services/api/orders.service";
import {LoaderComponent} from "../loader/loader.component";
import {ProfileService} from "../../services/api/profile.service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  readonly need_loader_count = 3;
  readonly orders_show_count = 2;
  readonly monthNames: string[] = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'ноября', 'декабря'];
  public active_orders: OrderModel[] = [];
  public active_orders_index: number = 0;

  public history_orders: OrderModel[] = [];
  public history_orders_index: number = 0;

  public loader_count = 0;

  constructor(
    private localstorage: LocalstorageService,
    public router: RoutingService,
    private orders_api: OrdersService,
    private profile_service: ProfileService,
  ) {
  }

  ngOnInit(): void {
    LoaderComponent.show_loader(); // showing loader
    // getting user
    const token = this.localstorage.get('user-token');
    if (token === '') this.router.navigate('login');

    this.get_orders();
    this.getProfile();
  }

  getProfile() {
    this.profile_service.get().subscribe(resp => {
      this.hide_loader();
    }, () => {
      this.router.navigate('login');
    })
  }

  hide_loader() {
    this.loader_count++;
    if (this.loader_count >= this.need_loader_count) LoaderComponent.hide_loader();
  }

  get_orders() {
    this.orders_api.get_history().subscribe(
      resp => {
        if (resp.meets !== undefined)
          this.history_orders = resp.meets;
        this.hide_loader();
      }, () => {
        this.hide_loader();
      }
    );
    this.orders_api.get_active().subscribe(
      resp => {
        if (resp.meets !== undefined)
          this.active_orders = resp.meets;
        this.hide_loader();
      }, () => {
        this.hide_loader();
      }
    )
  }

  changeActiveOrderIndex(count: number) {
    this.active_orders_index = Math.max(0, Math.min(this.active_orders_index + count, (this.active_orders.length - this.orders_show_count) / this.orders_show_count));
  }

  changeHistoryOrderIndex(count: number) {
    this.history_orders_index = Math.max(0, Math.min(this.history_orders_index + count, (this.history_orders.length - this.orders_show_count) / this.orders_show_count));
  }

  get_active_orders_subarray() {
    let result: OrderModel[] = [];
    for (let i = this.active_orders_index * this.orders_show_count; i < Math.min(this.active_orders_index * this.orders_show_count + this.orders_show_count, this.active_orders.length); i++)
      result.push(this.active_orders[i]);
    return result;
  }

  get_history_orders_subarray() {
    let result: OrderModel[] = [];
    for (let i = this.history_orders_index * this.orders_show_count; i < Math.min(this.history_orders_index * this.orders_show_count + this.orders_show_count, this.history_orders.length); i++)
      result.push(this.history_orders[i]);
    return result;
  }

  getDate(date_string: string) {
    let date = new Date(date_string);
    return `${date.getDate()} ${this.monthNames[date.getMonth()]} ${date.getFullYear()} года`
  }
}
