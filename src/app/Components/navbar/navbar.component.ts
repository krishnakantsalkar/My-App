import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { userloginservices } from 'src/app/Shared/services/userloginservice';
import { Router } from '@angular/router';
import { modeService } from '../../Shared/services/light-dark-Modeservice';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, AfterViewInit {
  public brightness: boolean;
  public special: boolean;
  public loggedInUser;
  public checkStatus;
  public dynamicCss: string;
  public liveDate = new Date();
  public activeCss: string;
  constructor(
    private cookies: CookieService,
    private logonServices: userloginservices,
    private router: Router,
    private defaultModeService: modeService,
    @Inject(PLATFORM_ID) private platformId: any,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getUserId();

    // method to show some nav tab only if user logged in
    this.logonServices.currentUsers.subscribe((data) => {
      this.checkStatus = data;
    });

    // brightness mode
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;

      if (this.brightness) {
        this.activeCss = 'activeCssL';
        Array.from(document.querySelectorAll('.nav-link')).forEach((el) => {
          if (el.classList.contains('activeCssD')) {
            el.classList.remove('activeCssD');
            el.classList.add('activeCssL');
          }
        });
      } else {
        this.activeCss = 'activeCssD';
        Array.from(document.querySelectorAll('.nav-link')).forEach((el) => {
          if (el.classList.contains('activeCssL')) {
            el.classList.remove('activeCssL');
            el.classList.add('activeCssD');
          }
        });
      }
    });
    // animate navbar on scroll

    if (!isPlatformBrowser(this.platformId)) {
    } else {
      let mediaQ = window.matchMedia('(max-width: 600px)');

      window.onscroll = function () {
        scrollFunction();
        scrollFunctionMedia(mediaQ);
      };
    }
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
    if (!isPlatformBrowser(this.platformId)) {
    } else {
      $(window).on('scroll', () => {
        if ($(window).scrollTop() > 50) {
          $('#myBtn').css('bottom', '25px');
        } else {
          $('#myBtn').css('bottom', '-50px');
        }
      });
    }
  }

  ngAfterViewInit() {
    setInterval(() => {
      this.liveDate = new Date();
    }, 60000);
  }
  // set global Light/Dark mode
  mode() {
    this.defaultModeService.switchMode();
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
