import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.css'],
})
export class Page404Component implements OnInit {
  public brightness;
  constructor() {}

  ngOnInit(): void {
    // call functions
    this.mode();
  }

  // dark/light mode
  mode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }
}
