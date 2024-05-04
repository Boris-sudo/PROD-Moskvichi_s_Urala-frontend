import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {LocalstorageService} from "../../services/localstorage.service";
import {RoutingService} from "../../services/routing.service";
import {LoginService} from "../../services/api/login.service";


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent implements OnInit {
  private phone_number: string = '';
  private password: string = '';

  constructor(
    private localstorage: LocalstorageService,
    private router: RoutingService,
    private login_service: LoginService,
  ) {
  }

  ngOnInit(): void {
  }

  set_phone() {
    const container = document.getElementById('phone-input')!;
    // @ts-ignore
    this.phone_number = container.value;
    if (this.phone_number[0]!=='+') {
      this.phone_number = '+' + this.phone_number;
      if (this.phone_number[1]==='8') this.phone_number='+7'+this.phone_number.substring(2,this.phone_number.length);
    } else {
      if (this.phone_number[1]==='8') this.phone_number='+7'+this.phone_number.substring(2,this.phone_number.length);
    }

    // @ts-ignore
    container.value = this.phone_number;
  }

  is_phone_valid():boolean {
    if (this.phone_number.length < 2) return true;
    return !(this.phone_number.length > 12 || this.phone_number[1] !== '7');
  }

  set_password() {
    const container = document.getElementById('password-input')!;
    // @ts-ignore
    this.password = container.value;
  }

  login() {
    this.login_service.login({'phone': this.phone_number, 'password': this.password}).subscribe(
      resp => {
        this.localstorage.set('user-token', resp.token);
        this.router.navigate('');
      },error => {
      }
    )
  }
}
