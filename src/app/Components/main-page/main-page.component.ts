import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
  public brightness: boolean;
  constructor() {}

  ngOnInit(): void {
    this.defaultmode();
  }

  mode() {
    this.brightness = !this.brightness;
    localStorage.setItem('mode', JSON.stringify(this.brightness));
  }
  defaultmode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }
}
