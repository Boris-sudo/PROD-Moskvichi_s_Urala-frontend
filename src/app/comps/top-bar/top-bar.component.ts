import { Component, OnInit } from '@angular/core';
import {RoutingService} from "../../services/routing.service";

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  constructor(
    public router: RoutingService,
  ) { }

  ngOnInit(): void {
  }
}
