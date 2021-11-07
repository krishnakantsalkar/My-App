import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { userloginservices } from 'src/app/Shared/services/userloginservice';
import { Router, ActivatedRoute } from '@angular/router';
import { blogpostservice } from 'src/app/Shared/services/blogservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { contactService } from '../../Shared/services/contactUSservice';
import { IcontactUs } from '../../Shared/model/contactUsmodel';
import { CookieService } from 'ngx-cookie-service';
import { Jquery } from 'typings';
import { Title, Meta } from '@angular/platform-browser';
import { SnotifyService, SnotifyPosition } from 'ng-snotify';
import { modeService } from 'src/app/Shared/services/light-dark-Modeservice';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit, AfterViewInit {
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
  public checkStatus;

  public pageTitle = 'TheArsonist';

  public wallpapersArr: string[] = [
    'wallpaperflare.com_wallpaper.jpg',
    'pexels-felix-mittermeier-956981.jpg',
    'pexels-markus-spiske-1936299.jpg',
    'pexels-luis-gomes-546819.jpg',
  ];
  public wallpaperNum: number = parseInt(localStorage.getItem('wallpaperNum'));
  public picSourceArr: string[] = [
    'Wallpaperflare.com',
    'Felix mittermeier, Pexels',
    'Markus Spiske, Pexels',
    'Luis Gomes, Pexels',
  ];
  public picSource;

  constructor(
    private loginservice: userloginservices,
    private router: Router,
    private blogservice: blogpostservice,
    private fb: FormBuilder,
    private contactServices: contactService,
    private cookies: CookieService,
    private titleService: Title,
    private snotifyService: SnotifyService,
    private defaultModeService: modeService,
    private meta: Meta
  ) {
    // switch wallpaper method call
    // $(document).ready(() => {
    // });
  }

  ngOnInit(): void {
    // call methods
    let session = sessionStorage.getItem('session');
    if (!session) {
      $('#MainPage').css({ 'max-height': '100vh', overflow: 'hidden' });
    } else {
      $('#preloader').css({
        top: '-100vh',
      });
      $('.preloaderBg').css({
        display: 'none',
      });
      $('#MainPage').css({ 'max-height': 'initial', overflow: 'auto' });
    }
    sessionStorage.setItem('session', 'onGoing');

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: 'TheArsonist' });
    this.meta.updateTag({
      property: 'og:url',
      content: 'https://krishnakantsalkar.in/home',
    });
    this.meta.updateTag({
      property: 'og:site_name',
      content: 'https://krishnakantsalkar.in',
    });
    this.meta.updateTag({
      property: 'og:image',
      content:
        'https://user-images.githubusercontent.com/53054807/117562032-7f882800-b0b9-11eb-8917-3cb1fb970148.jpg',
    });
    this.meta.updateTag({ property: 'og:width', content: '1200' });

    this.meta.updateTag({ property: 'og:height', content: '630' });

    this.getspecials();
    this.recentUpdates();
    this.getUserId();
    this.showAdmin();

    // brightness mode
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;
    });

    this.loginservice.currentUsers.subscribe((item) => {
      this.checkStatus = item;
    });

    //title service
    this.titleService.setTitle(this.pageTitle);

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
    // preloaderPage();

    // Preloading Page logic
    // $('#MainPage').hide();
    // loop text function

    // async function textSequence(i) {
    //   var textLoop = [
    //     'Preparing...',
    //     'adding Bugs..',
    //     'Catching Exceptions',
    //     'Initializing the Prototype..',
    //     'Systems Ready..',
    //   ];

    //   if (document.getElementById('loopText')) {
    //     if (textLoop.length > i) {
    //       setTimeout(function () {
    //         if (document.getElementById('loopText')) {
    //           document.getElementById('loopText').innerHTML = textLoop[i];
    //           document.getElementById('loopText').style.fontFamily =
    //             "'Lucida Console', 'LucidaConsole', 'monospace'";
    //           textSequence(++i);
    //         }
    //       }, 900); // enter seconds (in milliseconds)
    //     } else if (textLoop.length == i) {
    //       // Loop
    //       textSequence(0);
    //     }
    //   }
    // }

    // progress bar logic

    // async function update() {
    //   if (document.getElementById('progress')) {
    //     var element = document.getElementById('progress');
    //     var width = 1;
    //     var identity = setInterval(scene, 50);
    //     function scene() {
    //       if (width >= 100) {
    //         clearInterval(identity);

    //         //show Main Page and hide preloader page once width reaches 100%
    //         $('#MainPage').fadeIn(300);
    //         // $('#preloader').hide(400);
    //         $('#preloader').css({ top: '0vh' });
    //       } else {
    //         width++;

    //         // increase progessbar and % width
    //         element.style.width = width + '%';
    //         document.getElementById('percent').innerHTML = width * 1 + '%';
    //       }
    //     }
    //   }
    // }

    // function preloaderPage() {
    //   let session = sessionStorage.getItem('session');
    //   if (!session) {
    //     $('#MainPage').hide();
    //     textSequence(0);
    //     update();
    //   } else {
    //     $('#MainPage').fadeIn(300);
    //     // $('#preloader').hide(400);
    //     $('#preloader').css({ top: '0vh' });
    //   }
    //   sessionStorage.setItem('session', 'onGoing');
    // }

    // set wallpaper preference default
    let wallpaperPref = localStorage.getItem('wallpaperNum');
    if (!wallpaperPref) {
      localStorage.setItem('wallpaperNum', '0');
    }

    // disable brightness toggle
    $(document).ready(() => {
      $('.modeLD a').css('pointer-events', 'all');
      $('.modeLD a').css('opacity', 1);
    });

    // website uses cookies check
    this.checkWebsiteUsesDiag();
  }

  ngAfterViewInit() {
    this.showWalls();
  }

  enter() {
    $('#preloader').css({
      top: '-100vh',
    });
    $('.preloaderBg').css({
      display: 'none',
    });
    $('#MainPage').css({ 'max-height': 'initial', overflow: 'auto' });

    this.showNotif();
  }

  // set global Light/Dark mode
  mode() {
    this.brightness = !this.brightness;
    localStorage.setItem('mode', JSON.stringify(this.brightness));
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
    let d = document;
    d.getElementById('uploadSpinner2').style.display = 'inline-block';
    d.getElementById('uploadCheckErr2').style.display = 'none';

    this.contactServices.contact(data).subscribe(
      (item) => {
        this.logResponse = item;
        let elemnt = document.getElementById('overlay');
        elemnt.style.zIndex = '3';
        d.getElementById('uploadSpinner2').style.display = 'none';
        d.getElementById('uploadCheckErr2').style.display = 'none';
        d.getElementById('uploadCheck2').style.display = 'inline-block';
      },
      (error) => {
        this.errResponse = error.error;
        let elemnt = document.getElementById('overlay');
        elemnt.style.zIndex = '3';
        d.getElementById('uploadSpinner2').style.display = 'none';
        d.getElementById('uploadCheckErr2').style.display = 'inline-block';
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
    let d = document;
    d.getElementById('uploadSpinner1').style.display = 'inline-block';
    d.getElementById('uploadCheckErr1').style.display = 'none';
    this.blogservice.subscribeNewsLetter(data).subscribe(
      (item) => {
        this.newsLetterSuccess = item;
        d.getElementById('uploadSpinner1').style.display = 'none';
        d.getElementById('uploadCheckErr1').style.display = 'none';
        d.getElementById('uploadCheck1').style.display = 'inline-block';
      },
      (err) => {
        this.newsLetterError = err.error.message;
        d.getElementById('uploadSpinner1').style.display = 'none';
        d.getElementById('uploadCheckErr1').style.display = 'inline-block';
      }
    );
  }

  // show notification to user
  async showNotif() {
    setTimeout(() => {
      if (!sessionStorage.getItem('mainPageToast')) {
        this.snotifyService.info(
          'Welcome User, Search for your fav Movies & TV shows!',
          'TheArsonist',
          {
            timeout: 12000,
            showProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            icon: 'assets/images/mylogo.jpg',
            buttons: [
              {
                text: 'Movies & TV',
                action: () => this.router.navigateByUrl('/Movies&TV'),
                bold: false,
              },
              {
                text: 'Close',
                action: (toast) => {
                  this.snotifyService.remove(toast.id);
                },
                bold: true,
              },
            ],
            position: SnotifyPosition.rightBottom,
          }
        );
      }
      sessionStorage.setItem('mainPageToast', 'notified');
    }, 8000);
  }

  // show wallpaper from wallpaperPref
  showWalls() {
    $('#bgImg').css({
      'background-image': `url('../../../assets/images/${
        this.wallpapersArr[localStorage.getItem('wallpaperNum')]
      }')`,
    });
    $('.nametag').addClass('pseudo');

    this.picSource = this.picSourceArr[localStorage.getItem('wallpaperNum')];
  }

  //wallpaper switcher
  switchWalls() {
    if (this.wallpaperNum <= 3) {
      this.wallpaperNum = this.wallpaperNum + 1;
      localStorage.setItem('wallpaperNum', `${this.wallpaperNum}`);
      this.showWalls();
    }

    if (this.wallpaperNum == 4) {
      this.wallpaperNum = 0;
      localStorage.setItem('wallpaperNum', `${this.wallpaperNum}`);
      this.showWalls();
    }
  }
}
