import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ProductModel} from "../../models/product.model";
import {LoaderComponent} from "../loader/loader.component";
import {DocumentService} from "../../services/api/document.service";
import {ProductService} from "../../services/api/product.service";
import {DocumentModel} from "../../models/document.model";
import {GeoLocationService} from "../../services/geo-location.service";
import {BlockedTimesService} from "../../services/api/blocked-times.service";
import {BlockedTimesModel} from "../../models/blocked-times.model";
import {RoutingService} from "../../services/routing.service";
import {ProfileService} from "../../services/api/profile.service";
import {ProfileModel} from "../../models/profile.model";
import {Subject} from "rxjs";
import {OfferLocationsService} from "../../services/api/offer-locations.service";

@Component({
  selector: 'app-make-new-meeting',
  templateUrl: './make-new-meeting.component.html',
  styleUrls: ['./make-new-meeting.component.css']
})
export class MakeNewMeetingComponent implements OnInit, OnDestroy {
  readonly WeekDays: string[] = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
  readonly MonthNames: string[] = ['янв.', 'фев.', 'марта', 'апр.', 'мая', 'июня', 'июля', 'авг.', 'сент.', 'нояб.', 'дек.'];

  map: any;
  @ViewChild('yamaps')
  el!: ElementRef;
  location_changes = new Subject();
  public location_changes$ = this.location_changes.asObservable();
  public offer_locations: { name: string, lon: number, lat: number }[] = [];

  readonly need_loading_count: number = 5;
  public products: ProductModel[] = [];
  public documents: DocumentModel[] = [];
  private loading_count: number = 0;
  public chosen_product?: ProductModel;

  public near_dates: { date: string, title: string }[] = [];
  public chosen_date: string = (new Date()).toJSON().split('T')[0];
  readonly all_times: string[] = [];
  public chosen_time?: string;
  private blocked_times: BlockedTimesModel = {blocked_times: {}};

  private uploaded_docs: number[] = [];

  public chosen_location: number[] = [];
  private employers?: any;
  public chosen_pred: string | null = null;

  public choose_page: number = 1;
  public hover_page: number = 1;

  constructor(
    private router: RoutingService,
    private documents_service: DocumentService,
    private products_service: ProductService,
    private blocked_times_service: BlockedTimesService,
    private geolocation: GeoLocationService,
    private profile_service: ProfileService,
    private locations_service: OfferLocationsService,
  ) {
  }

  ngOnInit(): void {
    LoaderComponent.show_loader();
    this.getDocuments();
    this.getProducts();
    this.getUploadedDocs();
    this.getNearestDates();
    this.getOfferLocations();

    this.geolocation.getLocation();
    this.geolocation.subscribers$.subscribe(() => {
      this.initMap().then();
    });
  }

  ngOnDestroy() {
    this.map.destroy();
  }

  async initMap() {
    this.chosen_location = [this.geolocation.Longitude, this.geolocation.Latitude]
    // @ts-ignore
    await ymaps3.ready;
    // @ts-ignore
    const {YMap, YMapDefaultSchemeLayer, YMapListener, YMapDefaultFeaturesLayer} = ymaps3;
    // @ts-ignore
    const {YMapDefaultMarker} = await ymaps3.import('@yandex/ymaps3-markers@0.0.1');

    this.map = new YMap(
      document.getElementById('map'),
      {
        location: {
          center: [this.geolocation.Longitude, this.geolocation.Latitude],
          zoom: 10,
        }
      }
    );

    let changeMapPosition = (location: any, camera: any) => {
      this.map.update({location: {...location, duration: 1000}, camera});
    };

    this.map.addChild(new YMapDefaultSchemeLayer());
    this.map.addChild(new YMapDefaultFeaturesLayer());

    let pointA = new YMapDefaultMarker({
      coordinates: [this.geolocation.Longitude, this.geolocation.Latitude],
    });
    this.map.addChild(pointA);

    this.location_changes$.subscribe((loc) => {
      console.log(2);
      document.getElementById('map-error')!.innerText = '';
      this.employers = undefined;
      // @ts-ignore
      const coords = [loc.lon, loc.lat];
      changeMapPosition({center: coords, zoom: 10}, {tilt: 0});
      this.chosen_location = coords;
      pointA.update({coordinates: coords});
    });


    this.map.addChild(new YMapListener({
      onClick: (some_shit: any, event: any) => {
        document.getElementById('map-error')!.innerText = '';
        this.employers = undefined;
        const coords = event.coordinates;
        changeMapPosition({center: coords, zoom: 10}, {tilt: 0});
        this.chosen_location = coords;
        pointA.update({coordinates: coords});
      }
    }));

    this.hideLoading();
  }

  getOfferLocations() {
    this.locations_service.get().subscribe(resp => {
      this.offer_locations = resp.locations;
      this.hideLoading();
    })
  }

  changeLocationWithLoc(loc: any) {
    console.log(1);
    this.location_changes.next(loc);
  }

  convertDateToText(date: Date) {
    return `${this.WeekDays[date.getDay()]}, ${date.getDate()} ${this.MonthNames[date.getMonth()]}`
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

  highlightRed(el: HTMLElement) {
    el.style.background = 'rgb(var(--red))';
    setTimeout(()=>{
      el.style.background = 'rgb(var(--yellow))';
    }, 300);
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

  hideLoading() {
    this.loading_count++;
    if (this.loading_count >= this.need_loading_count) LoaderComponent.hide_loader();
  }

  checkLocation() {
    this.blocked_times_service.checkLocation(this.chosen_location[0], this.chosen_location[1], this.chosen_product!.id).subscribe(
      resp => {
        this.employers = resp.employers;
        if (resp.error) {
          document.getElementById('map-error')!.innerText = 'К сожалению встреча в данной области недоступна.'
          return;
        }
        this.choosePage(3);
      }, error => {
        document.getElementById('map-error')!.innerText = 'К сожалению встреча в данной области недоступна.'
      }
    )
  }

  chooseTime(time: string) {
    if (this.checkTimeAvailable(time)) this.chosen_time = (this.chosen_time == time ? undefined : time);
  }

  getUploadedDocs() {
    this.profile_service.get().subscribe(resp => {
      let profile: ProfileModel = resp.profile;
      for (const doc_id of profile.documents)
        this.uploaded_docs.push(doc_id.document_id);
      this.hideLoading();
    }, () => {
      this.router.navigate('login');
    })
  }

  doesDocUploaded(doc_id: number) {
    for (const uploadedDoc of this.uploaded_docs)
      if (doc_id === uploadedDoc)
        return true;
    return false;
  }

  getBlockedTimes() {
    this.blocked_times_service.getAvailableTimes(this.employers).subscribe(
      resp => {
        this.blocked_times = resp;
        this.hideLoading();
      }, () => {
        this.hideLoading();
      }
    );
  }

  getFinalDate() {
    let result: string = '';
    for (const date of this.near_dates)
      if (date.date === this.chosen_date)
        result = date.title;
    result += ' ' + this.chosen_time;
    return result;
  }

  getProducts() {
    this.products_service.get().subscribe(
      resp => {
        this.products = resp.products;
        this.hideLoading();
      }, () => {
        this.hideLoading();
      }
    );
  }

  getDocuments() {
    this.documents_service.get().subscribe(
      resp => {
        this.documents = resp.documents;
        this.hideLoading();
      }, () => {
        this.hideLoading();
      }
    );
  }

  getChosenDocs(): DocumentModel[] {
    let result: DocumentModel[] = [];
    if (this.chosen_product == undefined) return [];
    for (const doc of this.documents)
      for (const document_id of this.chosen_product!.documents) {
        if (doc.id == document_id)
          result.push(doc);
      }
    return result;
  }

  submitMeeting() {
    console.log(this.chosen_date);
    this.blocked_times_service.submitMeeting(this.chosen_location[0], this.chosen_location[1], this.chosen_product!.id!, `${this.chosen_date} ${this.chosen_time?.split(' ')[0]}`, this.chosen_pred).subscribe(
      resp => {
        this.router.navigate('');
      }, error => {
      }
    );
  }

  choosePage(page: number) {
    let highlight = () => {
      if (page < this.choose_page) this.highlightRed(document.getElementById('prev-make-meeting-btn')!);
      else this.highlightRed(document.getElementById('next-make-meeting-btn')!);
    };
    if (page > this.choose_page) {
      if (this.choose_page === 1 && this.chosen_product === undefined) {
        highlight(); return;
      } else if (this.choose_page === 2 && this.chosen_location === []) {
        highlight(); return;
      } else if (this.choose_page === 3 && (this.chosen_date === undefined || this.chosen_time === undefined)) {
        highlight(); return;
      }
    }


    if (this.choose_page === 2 && page === 3 && this.employers === undefined) {
      this.checkLocation();
      return;
    } else if (this.choose_page === 2 && page === 3) this.getBlockedTimes();

    if (page <= 0 || page > 5) {
      highlight(); return;
    }
    this.choose_page = page;
    this.hover_page = this.choose_page;

    const card = document.getElementById('form-card' + page)!;
    const roller = document.getElementById('form-roller')!;

    roller.scrollTo({
      left: card.offsetLeft,
      behavior: "smooth",
    });
  }
}
