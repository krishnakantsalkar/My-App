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
import { Title } from '@angular/platform-browser';
import {SnotifyService, SnotifyPosition} from 'ng-snotify';

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
  public newsLetterForm: FormGroup;
  public newsLetterSuccess;
  public newsLetterError;

  public pageTitle = 'TheArsonist'
  
  public wallpapersArr: string[] = ['wallpaperflare.com_wallpaper.jpg', 'pexels-felix-mittermeier-956981.jpg', 'pexels-markus-spiske-1936299.jpg','pexels-luis-gomes-546819.jpg']
  public wallpaperNum: number = 0
  public picSourceArr: string[] = ['Wallpaperflare.com', 'Felix mittermeier, Pexels', 'Markus Spiske, Pexels', 'Luis Gomes, Pexels']
  public picSource
  
  constructor(
    private loginservice: userloginservices,
    private router: Router,
    private blogservice: blogpostservice,
    private fb: FormBuilder,
    private contactServices: contactService,
    private cookies: CookieService,
    private titleService: Title,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit(): void {
    // call methods
    this.defaultmode();
    this.getspecials();
    this.recentUpdates();
    this.getUserId();
    this.showAdmin();
    this.showNotif()

    //title service
    this.titleService.setTitle(this.pageTitle)

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

    // newsletter form
    this.newsLetterForm = this.fb.group({
      userEmail: ['', [Validators.required, Validators.email]],
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
            $('#MainPage').fadeIn(300);
            $('#preloader').hide();
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
        $('#MainPage').hide();
        textSequence(0);
        update();
      } else {
        $('#MainPage').fadeIn(300);
        $('#preloader').hide();
      }
      sessionStorage.setItem('session', 'onGoing');
    }

    // Toast initialize
    // (<Jquery>$('.toast')).toast('show');

    // dark and light mode listener
    $('.modeLD a').on('click', () => {
      this.ngOnInit();
    });

    // disable brightness toggle
    $(document).ready(() => {
      $('.modeLD a').css('pointer-events', 'all');
      $('.modeLD a').css('opacity', 1);
    });

    // website uses cookies check
    this.checkWebsiteUsesDiag();
  
  
    // wallpaper switcher
    this.switchWalls()
  
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
      if (temp) {
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
    let adblockPreference = this.cookies.get('adblockPref');
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
    this.cookies.set('adblockPref', 'disabled', 5);
    location.reload();
  }

  // website uses cookies dialog
  websiteUsesDiag() {
    document.getElementById('websiteUsesDialog').style.display = 'none';

    this.cookies.set('websiteUsesDiag', 'done', 5);
  }

  // check website uses dialog
  async checkWebsiteUsesDiag() {
    let temp = this.cookies.get('websiteUsesDiag');
    if (!temp) {
      document.getElementById('websiteUsesDialog').style.display = 'block';
    }
  }

  //newsLetter Subscribe
  subscribeNewsLetter(data) {
    if (!this.newsLetterForm.valid) {
      return;
    }
    this.blogservice.subscribeNewsLetter(data).subscribe(
      (item) => {
        this.newsLetterSuccess = item;
      },
      (err) => {
        this.newsLetterError = err.error.message;
      }
    );
  }

  async showNotif(){
    this.snotifyService.info('Welcome User, Checkout the Covid-19 India Tracker!', 'TheArsonist',  {
      timeout: 12000,
      showProgressBar: true,    
      closeOnClick: false, 
      pauseOnHover: true,
      icon: 'assets/images/mylogo.jpg',
      buttons: [
        {text: 'Covid19', action: () => this.router.navigateByUrl('/Covid-Tracker'), bold: false},
        {text: 'Close', action: (toast) => {this.snotifyService.remove(toast.id); }, bold: true},
      ],
      position: SnotifyPosition.rightBottom
    }) 
  }


    //wallpaper switcher
    switchWalls(){

     $('.content').css({
        "background-image": `url('../../../assets/images/${this.wallpapersArr[this.wallpaperNum]}')`
      })
    
    this.picSource = this.picSourceArr[this.wallpaperNum]

    if(this.wallpaperNum <= 3){
      this.wallpaperNum = this.wallpaperNum + 1
    }
    
    if(this.wallpaperNum == 4){
      this.wallpaperNum = 0
    }

  }

}
