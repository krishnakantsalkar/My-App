import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { userloginservices } from 'src/app/Shared/services/userloginservice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
  public brightness: boolean;
  public special: boolean;
  constructor(
    private loginservice: userloginservices,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.defaultmode();
    this.getspecials();
    AOS.init();
  }

  mode() {
    this.brightness = !this.brightness;
    localStorage.setItem('mode', JSON.stringify(this.brightness));
  }
  defaultmode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }

  getspecials() {
    let temp = JSON.parse(localStorage.getItem('credentials'));
    if (temp === true) {
      this.special = true;
    } else {
      this.special = false;
    }
    console.log(this.special);
  }

  logout() {
    localStorage.removeItem('credentials');
    location.reload();
  }
}
