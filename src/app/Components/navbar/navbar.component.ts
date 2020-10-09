import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { userloginservices } from 'src/app/Shared/services/userloginservice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public brightness: boolean;
  public special: boolean;
  public loggedInUser;
  public checkStatus;
  constructor(
    private cookies: CookieService,
    private logonServices: userloginservices,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.defaultmode();
    this.getUserId();

    this.logonServices.currentUsers.subscribe((data) => {
      this.checkStatus = data;
      // method to show some nav tab only if user logged in
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
        document.getElementById('top-panel').style.padding = '5px 10px 5px';
        document.getElementById('top-panel').style.transitionDuration = '0.2s';
        document.getElementById('top-panel').style.transitionTimingFunction =
          'ease-in';
      } else {
        document.getElementById('top-panel').style.padding = '20px 10px 20px';
      }
    }

    function scrollFunctionMedia(mediaQuery) {
      if (
        (mediaQuery.matches && document.body.scrollTop > 50) ||
        (mediaQuery.matches && document.documentElement.scrollTop > 50)
      ) {
        if (document.getElementById('top-panel')) {
          document.getElementById('top-panel').style.padding = '12px 10px 12px';
        }
      } else if (
        (mediaQuery.matches && document.body.scrollTop < 50) ||
        (mediaQuery.matches && document.documentElement.scrollTop < 50)
      ) {
        if (document.getElementById('top-panel')) {
          document.getElementById('top-panel').style.padding = '20px 10px 20px';
        }
      }
    }

    // go to top btn show/hide
    $(window).on('scroll', () => {
      if ($(window).scrollTop() > 50) {
        $('#myBtn').css('bottom', '15px');
      } else {
        $('#myBtn').css('bottom', '-50px');
      }
    });
  }

  // set global Light/Dark mode
  mode() {
    this.brightness = !this.brightness;
    localStorage.setItem('mode', JSON.stringify(this.brightness));
    this.update();
  }

  update() {
    this.ngOnInit();
  }
  // global Light/Dark mode
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

  // logout method
  logout() {
    this.logonServices.Logout();
  }

  // get id for profile page navigation
  getUserId() {
    this.loggedInUser = JSON.parse(localStorage.getItem('id'));
  }
}
