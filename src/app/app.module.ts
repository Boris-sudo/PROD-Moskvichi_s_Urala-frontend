import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MainPageComponent} from './comps/main-page/main-page.component';
import {LoginPageComponent} from './comps/login-page/login-page.component';
import {TopBarComponent} from './comps/top-bar/top-bar.component';
import {HttpClientModule, HttpClientXsrfModule} from "@angular/common/http";
import { LoaderComponent } from './comps/loader/loader.component';
import { ProfileComponent } from './comps/profile/profile.component';
import { MakeNewMeetingComponent } from './comps/make-new-meeting/make-new-meeting.component';
import { ViewMeetingComponent } from './comps/view-meeting/view-meeting.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    LoginPageComponent,
    TopBarComponent,
    LoaderComponent,
    ProfileComponent,
    MakeNewMeetingComponent,
    ViewMeetingComponent,
  ],
    imports: [
        HttpClientModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'csrftoken',
            headerName: 'X-CSRFToken',
        }),
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
