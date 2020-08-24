import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { userloginservices } from 'src/app/Shared/services/userloginservice';
import { Router } from '@angular/router';
import { blogpostservice } from 'src/app/Shared/services/blogservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { contactService } from '../../Shared/services/contactUSservice';
import { IcontactUs } from '../../Shared/model/contactUsmodel';
import { CookieService } from 'ngx-cookie-service';

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
  public sendFeedback: FormGroup;
  public logResponse;
  public errResponse;
  constructor(
    private loginservice: userloginservices,
    private router: Router,
    private blogservice: blogpostservice,
    private fb: FormBuilder,
    private contactServices: contactService,
    private cookies: CookieService
  ) {}

  ngOnInit(): void {
    this.defaultmode();
    this.getspecials();
    AOS.init({
      startEvent: 'DOMContentLoaded',
    });
    this.recentUpdates();
    this.getUserId();

    this.sendFeedback = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.min(5)]],
    });

    // animate navbar on scroll
    let mediaQ = window.matchMedia('(max-width: 600px)');

    window.onscroll = function () {
      scrollFunction();
      scrollFunctionMedia(mediaQ);
    };

    function scrollFunction() {
      if (
        document.body.scrollTop > 50 ||
        document.documentElement.scrollTop > 50
      ) {
        if (
          document.getElementById('top-panel') ||
          document.getElementById('top-panel-nametag')
        ) {
          document.getElementById('top-panel').style.height = '60px';
          document.getElementById('top-panel').style.transitionDuration =
            '0.2s';
          document.getElementById('top-panel').style.transitionTimingFunction =
            'ease-in';
          document.getElementById('top-panel-nametag').style.paddingTop =
            '10px';
        }
      } else {
        if (
          document.getElementById('top-panel') ||
          document.getElementById('top-panel-nametag')
        ) {
          document.getElementById('top-panel').style.height = '90px';
          document.getElementById('top-panel-nametag').style.paddingTop =
            '25px';
        }
      }
    }

    function scrollFunctionMedia(mediaQuery) {
      if (
        (mediaQuery.matches && document.body.scrollTop > 50) ||
        (mediaQuery.matches && document.documentElement.scrollTop > 50)
      ) {
        document.getElementById('top-panel').style.height = '55px';
        document.getElementById('top-panel-nametag').style.paddingTop = '15px';
      } else if (
        (mediaQuery.matches && document.body.scrollTop < 50) ||
        (mediaQuery.matches && document.documentElement.scrollTop < 50)
      ) {
        document.getElementById('top-panel').style.height = '75px';
        document.getElementById('top-panel-nametag').style.paddingTop = '25px';
      }
    }
  }

  mode() {
    this.brightness = !this.brightness;
    localStorage.setItem('mode', JSON.stringify(this.brightness));
  }
  defaultmode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }

  getspecials() {
    // let temp = JSON.parse(localStorage.getItem('credentials'));
    let loggedinUser = this.cookies.get('credentials');
    if (loggedinUser) {
      let temp = JSON.parse(this.cookies.get('credentials'));
      if (temp === true) {
        this.special = true;
      } else {
        this.special = false;
      }
    }
  }

  logout() {
    this.cookies.delete('credentials');

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

  Send(data: IcontactUs) {
    if (!this.sendFeedback.valid) {
      return;
    }
    this.contactServices.contact(data).subscribe(
      (item) => {
        this.logResponse = item;
        let elemnt = document.getElementById('overlay');
        elemnt.style.zIndex = '3';
      },
      (error) => {
        this.errResponse = error.error;
        let elemnt = document.getElementById('overlay');
        elemnt.style.zIndex = '3';
      }
    );
  }

  off() {
    var elemnt = document.getElementById('overlay');

    elemnt.style.zIndex = '-10';
    location.reload();
  }
}
