import {Injectable} from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(
    private router: Router,
  ) {
  }

  navigate(link: string, prev_link?: string): void {
    this.router.navigate([link]).then(() => {
      window.location.reload();
    });
  }
}
