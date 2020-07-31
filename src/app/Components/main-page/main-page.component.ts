import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { userloginservices } from 'src/app/Shared/services/userloginservice';
import { Router } from '@angular/router';
import { blogpostservice } from 'src/app/Shared/services/blogservice';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
  public brightness: boolean;
  public special: boolean;
  public recentblogs;
  public loggedInUser;
  constructor(
    private loginservice: userloginservices,
    private router: Router,
    private blogservice: blogpostservice
  ) {}

  ngOnInit(): void {
    this.defaultmode();
    this.getspecials();
    AOS.init({
      startEvent: 'DOMContentLoaded',
    });
    this.recentUpdates();
    this.getUserId();
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
    localStorage.removeItem('id');
    location.reload();
  }

  recentUpdates() {
    this.blogservice.getBlogs().subscribe((item) => {
      this.recentblogs = item;
    });
  }

  getUserId() {
    this.loggedInUser = JSON.parse(localStorage.getItem('id'));
  }
}
