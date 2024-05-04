import {Component, OnInit} from '@angular/core';
import {LocalstorageService} from "../../services/localstorage.service";
import {RoutingService} from "../../services/routing.service";
import {ProfileModel} from "../../models/profile.model";
import {ProfileService} from "../../services/api/profile.service";
import {LoaderComponent} from "../loader/loader.component";
import {GeoLocationService} from "../../services/geo-location.service";
import {DocumentModel} from "../../models/document.model";
import {DocumentService} from "../../services/api/document.service";
import {LoginService} from "../../services/api/login.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  readonly need_loader_count: number = 2;
  private have_loader_count: number = 0;
  public profile: ProfileModel = {name: '', phone: '', documents:[]};
  public documents: { document: DocumentModel, date: string }[] = [];

  constructor(
    private localstorage: LocalstorageService,
    private router: RoutingService,
    private document_service: DocumentService,
    private profile_service: ProfileService,
    private geolocation: GeoLocationService,
    private login_service: LoginService,
  ) {
  }

  ngOnInit(): void {
    LoaderComponent.show_loader();
    const token = this.localstorage.get('user-token');
    if (token === '') this.router.navigate('login');
    this.getCity();
    this.getProfile();

    let target = document.getElementById('city-name')!;
    let observer = new MutationObserver(() => {
      this.hideLoader();
    });
    let config = {attributes: true, childList: true, characterData: true};
    observer.observe(target, config);
  }

  hideLoader() {
    this.have_loader_count++;
    if (this.have_loader_count >= this.need_loader_count) LoaderComponent.hide_loader();
  }

  getDocuments() {
    this.document_service.get().subscribe(
      resp => {
        let array: DocumentModel[] = resp.documents;
        for (const doc of array)
          for (const document of this.profile.documents)
            if (doc.id === document.document_id)
              this.documents.push({document: doc, date: document.expired_date.substring(0,document.expired_date.length-13)});
        this.hideLoader();
      }
    )
  }

  logout() {
    this.login_service.logout().subscribe(() => {
      this.router.navigate('login');
    })
  }

  getProfile() {
    this.profile_service.get().subscribe(
      resp => {
        this.profile = resp.profile;
        this.getDocuments();
      }, () => {
        this.router.navigate('login');
      }
    );
  }

  getCity() {
    this.geolocation.showCity();
    this.geolocation.subscribers$.subscribe(() => this.hideLoader());
  }

}
