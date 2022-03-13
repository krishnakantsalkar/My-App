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
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../shared-module/confirmation-dialog/confirmation-dialog.component';
import * as $ from 'jquery';

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
  public window = !isPlatformBrowser(this.platformId)
    ? { innerWidth: 1920 }
    : window;
  constructor(
    private cookies: CookieService,
    private logonServices: userloginservices,
    private router: Router,
    private defaultModeService: modeService,
    @Inject(PLATFORM_ID) private platformId: any,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document
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
        Array.from(this.document.querySelectorAll('.nav-link')).forEach(
          (el) => {
            if (el.classList.contains('activeCssD')) {
              el.classList.remove('activeCssD');
              el.classList.add('activeCssL');
            }
          }
        );
      } else {
        this.activeCss = 'activeCssD';
        Array.from(this.document.querySelectorAll('.nav-link')).forEach(
          (el) => {
            if (el.classList.contains('activeCssL')) {
              el.classList.remove('activeCssL');
              el.classList.add('activeCssD');
            }
          }
        );
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

      function scrollFunction() {
        if (
          this.document.body.scrollTop > 50 ||
          this.document.documentElement.scrollTop > 50
        ) {
          this.document.getElementById('top-panel').style.padding =
            '5px 10px 5px';
          this.document.getElementById('top-panel').style.transitionDuration =
            '0.2s';
          this.document.getElementById(
            'top-panel'
          ).style.transitionTimingFunction = 'ease-in';
        } else {
          this.document.getElementById('top-panel').style.padding =
            '20px 10px 20px';
        }
      }

      function scrollFunctionMedia(mediaQuery) {
        if (
          (mediaQuery.matches && this.document.body.scrollTop > 50) ||
          (mediaQuery.matches && this.document.documentElement.scrollTop > 50)
        ) {
          if (this.document.getElementById('top-panel')) {
            this.document.getElementById('top-panel').style.padding =
              '12px 10px 12px';
          }
        } else if (
          (mediaQuery.matches && this.document.body.scrollTop < 50) ||
          (mediaQuery.matches && this.document.documentElement.scrollTop < 50)
        ) {
          if (this.document.getElementById('top-panel')) {
            this.document.getElementById('top-panel').style.padding =
              '20px 10px 20px';
          }
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
    if (!isPlatformBrowser(this.platformId)) {
    } else {
      setInterval(() => {
        this.liveDate = new Date();
      }, 60000);
    }
  }
  // set global Light/Dark mode
  mode() {
    this.defaultModeService.switchMode();
  }

  // logout method
  logout() {
    let userData: any = `${JSON.parse(localStorage.getItem('user')).name} ${
      JSON.parse(localStorage.getItem('user')).surname
    }`;
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      minWidth: '30vw',
      data: {
        msg: `Would you like to Logout, ${userData}?`,
      },
    });

    dialogRef.afterClosed().subscribe((item) => {
      if (item && item.confirm == true) {
        this.logonServices.Logout();
      }
    });
  }

  // get id for profile page navigation
  getUserId() {
    this.loggedInUser = JSON.parse(localStorage.getItem('id'));
  }
}
