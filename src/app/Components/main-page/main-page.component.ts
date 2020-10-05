import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { userloginservices } from 'src/app/Shared/services/userloginservice';
import { Router, ActivatedRoute } from '@angular/router';
import { blogpostservice } from 'src/app/Shared/services/blogservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { contactService } from '../../Shared/services/contactUSservice';
import { IcontactUs } from '../../Shared/model/contactUsmodel';
import { CookieService } from 'ngx-cookie-service';
import { Jquery } from 'typings';

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
  public userName;
  constructor(
    private loginservice: userloginservices,
    private router: Router,
    private blogservice: blogpostservice,
    private fb: FormBuilder,
    private contactServices: contactService,
    private cookies: CookieService
  ) {}

  ngOnInit(): void {
    // call methods
    this.defaultmode();
    this.getspecials();
    this.recentUpdates();
    this.getUserId();
    this.showAdmin();

    // aos animation init.
    AOS.init({
      startEvent: 'DOMContentLoaded',
    });

    // Feedback, Reactive form
    this.sendFeedback = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.min(5)]],
    });

    // show only preloader only first time the session loads
    preloaderPage();

    // Preloading Page logic

    // loop text function

    async function textSequence(i) {
      var textLoop = [
        'Preparing...',
        'adding Bugs..',
        'Catching Exceptions',
        'Initializing the Prototype..',
        'Systems Ready..',
      ];

      if (document.getElementById('loopText')) {
        if (textLoop.length > i) {
          setTimeout(function () {
            if (document.getElementById('loopText')) {
              document.getElementById('loopText').innerHTML = textLoop[i];
              document.getElementById('loopText').style.fontFamily =
                "'Lucida Console', 'LucidaConsole', 'monospace'";
              textSequence(++i);
            }
          }, 900); // enter seconds (in milliseconds)
        } else if (textLoop.length == i) {
          // Loop
          textSequence(0);
        }
      }
    }

    // progress bar logic

    async function update() {
      if (document.getElementById('progress')) {
        var element = document.getElementById('progress');
        var width = 1;
        var identity = setInterval(scene, 50);
        function scene() {
          if (width >= 100) {
            clearInterval(identity);

            //show Main Page and hide preloader page once width reaches 100%
            document.getElementById('MainPage').style.display = 'block';
            document.getElementById('preloader').style.display = 'none';
          } else {
            width++;

            // increase progessbar and % width
            element.style.width = width + '%';
            document.getElementById('percent').innerHTML = width * 1 + '%';
          }
        }
      }
    }

    function preloaderPage() {
      let session = sessionStorage.getItem('session');
      if (!session) {
        document.getElementById('MainPage').style.display = 'none';
        textSequence(0);
        update();
      } else {
        document.getElementById('MainPage').style.display = 'block';
        document.getElementById('preloader').style.display = 'none';
      }
      sessionStorage.setItem('session', 'onGoing');
    }

    // Toast initialize
    (<Jquery>$('.toast')).toast('show');

    // dark and light mode listener
    $('.modeLD a').on('click', () => {
      this.ngOnInit();
    });

    // disable brightness toggle
    $(document).ready(() => {
      $('.modeLD a').css('pointer-events', 'all');
      $('.modeLD a').css('opacity', 1);
    });
  }

  // set global Light/Dark mode
  mode() {
    this.brightness = !this.brightness;
    localStorage.setItem('mode', JSON.stringify(this.brightness));
  }

  // global Light/Dark mode
  defaultmode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }

  // show special
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

  // show admin
  showAdmin() {
    let loggedinUser = this.cookies.get('credentials');

    if (loggedinUser) {
      let userData = JSON.parse(localStorage.getItem('user'));
      this.userName = userData;
    }
  }

  // logout method
  logout() {
    this.cookies.delete('credentials');
    localStorage.removeItem('user');
    localStorage.removeItem('id');
    location.reload();
  }

  // show latest blog post
  recentUpdates() {
    this.blogservice.getBlogs().subscribe((item) => {
      this.recentblogs = item;
    });
  }

  // get id for profile page navigation
  getUserId() {
    this.loggedInUser = JSON.parse(localStorage.getItem('id'));
  }

  // send feedback
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

  // turn off notif overlay
  off() {
    var elemnt = document.getElementById('overlay');

    elemnt.style.zIndex = '-10';
    location.reload();
  }

  // adblock detection
  detected(isDetected: boolean) {
    // console.log(`Adblock Detected:  ${isDetected}`);
    let adblockPreference = localStorage.getItem('adblockPref');
    if (!adblockPreference && isDetected === true) {
      document.getElementById('adblockOverlays').style.display = 'block';
    }
  }

  // yes i've disabled adblock button
  disableAdblockBtn() {
    location.reload();
  }

  // continue without adblock btn, save pref
  continueWithoutAdblockBtn() {
    localStorage.setItem('adblockPref', 'disabled');
    location.reload();
  }
}
