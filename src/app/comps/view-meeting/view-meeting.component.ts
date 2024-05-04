import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {OrdersService} from "../../services/api/orders.service";
import {OrderModel} from "../../models/order.model";
import {ActivatedRoute} from "@angular/router";
import {LoaderComponent} from "../loader/loader.component";
import {DocumentModel} from "../../models/document.model";
import {DocumentService} from "../../services/api/document.service";
import {RoutingService} from "../../services/routing.service";
import {BlockedTimesModel} from "../../models/blocked-times.model";
import {BlockedTimesService} from "../../services/api/blocked-times.service";

@Component({
  selector: 'app-view-meeting',
  templateUrl: './view-meeting.component.html',
  styleUrls: ['./view-meeting.component.css']
})
export class ViewMeetingComponent implements OnInit, OnDestroy {
  readonly all_stars: (1 | 2 | 3 | 4 | 5)[] = [1,1,1,1,1];
  readonly WeekDays: string[] = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  readonly MonthNames: string[] = ['янв.', 'фев.', 'марта', 'апр.', 'мая', 'июня', 'июля', 'авг.', 'сент.', 'нояб.', 'дек.'];
  readonly need_loading_count: number = 3;
  public have_loading_count: number = 0;
  public documents: DocumentModel[] = [];

  // @ts-ignore
  map: any;
  @ViewChild('yamaps')
  el!: ElementRef;
  public order: OrderModel = this.order_service.mock_orders[0];

  public near_dates: { date: string, title: string }[] = [];
  public chosen_date: string = (new Date()).toJSON().split('T')[0];
  readonly all_times: string[] = [];
  public chosen_time?: string;
  private blocked_times: BlockedTimesModel = {blocked_times: {}};

  constructor(
    private route: ActivatedRoute,
    private router: RoutingService,
    private order_service: OrdersService,
    private document_service: DocumentService,
    private blocked_times_service: BlockedTimesService,
  ) {
  }

  ngOnInit(): void {
    LoaderComponent.show_loader();
    this.getOrder();
    this.getNearestDates();
  }

  ngOnDestroy() {
  }

  async initMap() {
    // @ts-ignore
    await ymaps3.ready;
    // @ts-ignore
    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer} = ymaps3;
    // @ts-ignore
    const {YMapDefaultMarker} = await ymaps3.import('@yandex/ymaps3-markers@0.0.1');


    this.map = new YMap(
      document.getElementById('map2'),
      {
        location: {
          center: [this.order.address.lon, this.order.address.lat],
          zoom: 10,
        }
      }
    );

    this.map.addChild(new YMapDefaultSchemeLayer());
    this.map.addChild(new YMapDefaultFeaturesLayer());

    let pointA = new YMapDefaultMarker({
      coordinates: [this.order.address.lon, this.order.address.lat],
    });
    this.map.addChild(pointA);

    this.hideLoading();
  }

  chooseStar(rate: number) {
    this.order_service.rate_order(this.order.id, rate).subscribe(
      (resp)=>{
        console.log(resp);
        LoaderComponent.show_loader();
        this.have_loading_count--;
        this.getOrder();
      },
    );
  }

  hideLoading() {
    this.have_loading_count++;
    if (this.have_loading_count >= this.need_loading_count) LoaderComponent.hide_loader();
  }

  getDocuments() {
    this.documents = [];
    this.document_service.get().subscribe(
      resp => {
        let docs: DocumentModel[] = resp.documents;
        for (const doc of docs)
          for (const doc_id of this.order.documents)
            if (doc.id === doc_id)
              this.documents.push(doc);
        this.hideLoading();
      }
    )
  }

  getOrder() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id === 0) {
      this.initMap().then();
      return;
    }
    this.order_service.get_by_id(id).subscribe(
      resp => {
        this.order = resp.meet[0];
        if (resp.meet[0].rate === null) this.order.rate = 0;
        this.initMap().then();
        this.getDocuments();
        this.getBlockedTimes();
        console.log(resp);
        console.log(this.order);
      }, error => {
        this.initMap().then();
      }
    );
  }

  cancelOrder() {
    this.order_service.cancel_order(this.order.id).subscribe(() => {
      this.router.navigate('');
    })
  }

  showTimeMenu() {
    const menu = document.getElementById('time-menu')!;
    menu.style.display = 'flex';
    setTimeout(() => {
      menu.style.opacity = '1';
    }, 300);
  }

  closeTimeMenu() {
    const menu = document.getElementById('time-menu')!;
    menu.style.opacity = '0';
    setTimeout(() => {
      menu.style.display = 'none';
    }, 300);
  }

  changeOrderTime() {
    this.order_service.change_order_time(this.order.id, `${this.chosen_date} ${this.chosen_time!.split(' ')[0]}`).subscribe(() => {
      this.closeTimeMenu();
      LoaderComponent.show_loader();
      this.have_loading_count--;
      this.getOrder();
    })
  }

  checkTimeAvailable(time: string) {
    const current_date = (new Date).toJSON().split('T');
    if (current_date[0] === this.chosen_date && current_date[1].substring(0, 2) >= time.substring(0, 2)) return false;
    // @ts-ignore
    let array = this.blocked_times[this.chosen_date];
    if (array == null) return true;
    for (const blocked_time of array)
      if (blocked_time === time) return false;
    return true;
  }

  chooseTime(time: string) {
    if (this.checkTimeAvailable(time)) this.chosen_time = (this.chosen_time === time ? undefined : time);
  }

  convertDateToText(date: Date) {
    return `${this.WeekDays[date.getDay()]}, ${date.getDate()} ${this.MonthNames[date.getMonth()]}`
  }

  getNearestDates() {
    let current_date = new Date();
    for (let i = 0; i < 14; i++) {
      if (i < 14) this.near_dates.push({
        date: current_date.toJSON().split('T')[0],
        title: this.convertDateToText(current_date)
      });

      current_date.setDate(current_date.getDate() + 1);
    }

    for (let i = 10; i <= 19; i++) this.all_times.push(`${i}:00 - ${i + 1}:00`);
  }

  getBlockedTimes() {
    this.blocked_times_service.getAvailableTimes([this.order.employer_id]).subscribe(
      resp => {
        this.blocked_times = resp;
        this.hideLoading();
      }
    );
  }
}
