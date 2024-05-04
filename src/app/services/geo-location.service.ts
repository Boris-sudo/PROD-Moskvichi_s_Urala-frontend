import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GeoLocationService {
  public observer = new Subject();
  public subscribers$ = this.observer.asObservable();

  public Longitude: number = 0;
  public Latitude: number = 0;

  constructor(
  ) { }

  emit_data() {
    this.observer.next({});
  }

  getLocation(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      const longitude = position.coords.longitude;
      const latitude = position.coords.latitude;
      this.save_cords(longitude, latitude);
    }, ()=> {
      this.save_cords(37.6174782,55.7505412);
    });
  }

  getLocationName(coords: number[]) {
    const latitude = coords[0];
    const longitude = coords[1];

    var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true';
    return fetch(url);
  }

  save_cords(Longitude: number, Latitude: number) {
    this.Longitude = Longitude;
    this.Latitude = Latitude;
    this.emit_data();
  }

  showCity() {
    var result = document.getElementById("json-result");
    const Http = new XMLHttpRequest();
    function getLocation() {
      var bdcApi = "https://api.bigdatacloud.net/data/reverse-geocode-client"

      navigator.geolocation.getCurrentPosition(
        (position) => {
          bdcApi = bdcApi
            + "?latitude=" + position.coords.latitude
            + "&longitude=" + position.coords.longitude
            + "&localityLanguage=en";
          getApi(bdcApi);
        },
        (err) => { getApi(bdcApi); },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
    }
    function getApi(bdcApi: any) {
      Http.open("GET", bdcApi);
      Http.send();
      Http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          result = JSON.parse(this.responseText);
          // @ts-ignore
          document.getElementById('city-name')!.innerText = result!.localityInfo.administrative[3].name;
        }
      };
    }

    getLocation();
  }
}
