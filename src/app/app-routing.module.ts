import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from "./comps/main-page/main-page.component";
import {LoginPageComponent} from "./comps/login-page/login-page.component";
import {ProfileComponent} from "./comps/profile/profile.component";
import {MakeNewMeetingComponent} from "./comps/make-new-meeting/make-new-meeting.component";
import {ViewMeetingComponent} from "./comps/view-meeting/view-meeting.component";

const routes: Routes = [
  {path: '', component: MainPageComponent},

  {path: 'login', component: LoginPageComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'view/:id', component: ViewMeetingComponent},
  {path: 'create', component: MakeNewMeetingComponent},

  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
