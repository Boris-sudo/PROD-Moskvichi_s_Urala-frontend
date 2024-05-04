import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  static hide_loader() {
    const loader = document.getElementById('loader')!;
    loader.style.opacity = '0';
    setTimeout(()=>{
      loader.style.display = 'none';
    }, 300);
  }

  static show_loader() {
    const loader = document.getElementById('loader')!;
    loader.style.display = 'flex';
    setTimeout(()=>{
      loader.style.opacity = '1';
    });
  }
}
