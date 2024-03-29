import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import * as AOS from 'aos';
import { userloginservices } from 'src/app/Shared/services/userloginservice';
import { Router, ActivatedRoute, Routes } from '@angular/router';
import { blogpostservice } from 'src/app/Shared/services/blogservice';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { contactService } from '../../Shared/services/contactUSservice';
import { IcontactUs } from '../../Shared/model/contactUsmodel';
import { CookieService } from 'ngx-cookie-service';
import { Title, Meta } from '@angular/platform-browser';
// import { SnotifyService, SnotifyPosition } from 'ng-snotify';
import { modeService } from 'src/app/Shared/services/light-dark-Modeservice';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { UiService } from '../../Shared/services/ui.service';
import {
  MatBottomSheet,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import * as $ from 'jquery';
// import { routes } from '../../app-routing.module';

import { delay } from 'rxjs/operators';
import { from } from 'rxjs';
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit, AfterViewInit {
  public brightness: boolean;
  public special: boolean;
  public session: boolean;
  public loggedInUser;
  public sendFeedback: UntypedFormGroup;
  public logResponse;
  public errResponse;
  public userName;
  public newsLetterForm: UntypedFormGroup;
  public newsLetterSuccess;
  public newsLetterError;
  public checkStatus;

  public pageTitle = 'TheArsonist';

  public wallpapersArr: string[] = [
    '',
    'wallpaperflare.com_wallpaper.jpg',
    'pexels-felix-mittermeier-956981.jpg',
    'pexels-markus-spiske-1936299.jpg',
    'pexels-luis-gomes-546819.jpg',
  ];
  public wallpaperNum: number = parseInt(localStorage.getItem('wallpaperNum'));
  public picSourceArr: string[] = [
    '',
    'Wallpaperflare.com',
    'Felix mittermeier, Pexels',
    'Markus Spiske, Pexels',
    'Luis Gomes, Pexels',
  ];
  public picSource;

  @ViewChild('bottomSheet', { static: false })
  public bottomSheetDialog: TemplateRef<any>;

  public currentDate = new Date();
  tagLine: string = '';

  isPulse: boolean = true;

  constructor(
    private loginservice: userloginservices,
    private router: Router,
    private blogservice: blogpostservice,
    private fb: UntypedFormBuilder,
    private contactServices: contactService,
    private cookies: CookieService,
    private titleService: Title,
    // private snotifyService: SnotifyService,
    private defaultModeService: modeService,
    private meta: Meta,
    @Inject(PLATFORM_ID) private platformId: any,
    private uiService: UiService,
    private bottomSheetDiag: MatBottomSheet,
    @Inject(DOCUMENT) private document: Document
  ) {
    // switch wallpaper method call
    // $(() => {
    // });
  }

  ngOnInit(): void {
    // call methods

    if (!isPlatformBrowser(this.platformId)) {
    } else {
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

        this.checkWebsiteUsesDiag();
      }

      // set wallpaper preference default
      let wallpaperPref = localStorage.getItem('wallpaperNum');
      if (!wallpaperPref) {
        localStorage.setItem('wallpaperNum', '0');
      }

      // disable brightness toggle
      $(() => {
        $('.modeLD a').css('pointer-events', 'all');
        $('.modeLD a').css('opacity', 1);
      });

      // aos animation init.
      AOS.init({
        startEvent: 'DOMContentLoaded',
      });
    }
    this.meta.updateTag({
      property: 'description',
      content: "Hi, I'm Krishnakant Salkar, full-stack developer from mumbai.",
    });

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

    // this.getspecials();
    this.getUserId();
    this.showAdmin();

    // brightness mode
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;
    });

    this.uiService.checkSession$.subscribe((item) => {
      this.session = item;
    });

    this.loginservice.currentUsers.subscribe((item) => {
      this.checkStatus = item;
    });

    //title service
    this.titleService.setTitle(this.pageTitle);

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
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
    } else {
      this.showWalls();
      setTimeout(() => {
        $('.enterBtn').css({ opacity: '1' });
      }, 1000);

      setTimeout(() => {
        $('.preloader_quote').css({ opacity: '1' });
      }, 2000);
      setTimeout(() => {
        $('.preloader_quote_part1').css({ opacity: '1' });
      }, 2300);
      setTimeout(() => {
        $('.preloader_quote_part2').css({ opacity: '1' });
      }, 2500);
      setTimeout(() => {
        $('.preloader_quote_part3').css({ opacity: '1' });
      }, 3300);
      setTimeout(() => {
        $('.preloader_quote_part4').css({ opacity: '1' });
      }, 3900);
    }
  }

  switchPulse() {
    this.isPulse = !this.isPulse;
  }

  enter() {
    $('#preloader').css({
      top: '-100vh',
    });
    $('.preloaderBg').css({
      display: 'none',
    });
    $('#MainPage').css({ 'max-height': 'initial', overflow: 'auto' });

    if (!isPlatformBrowser(this.platformId)) {
    } else {
      sessionStorage.setItem('session', 'onGoing');
    }
    // website uses cookies check
    this.checkWebsiteUsesDiag();

    this.uiService.checkSession$.next(true);
    this.showNotif();
    // this.generateSitemap();
  }

  // set global Light/Dark mode
  mode() {
    this.defaultModeService.switchMode();
  }

  // show special
  getspecials() {
    // let temp = JSON.parse(localStorage.getItem('userToken'));
    let loggedinUser = this.cookies.get('userToken');
    if (loggedinUser) {
      let temp = JSON.parse(this.cookies.get('userToken'));
      if (temp) {
        this.special = true;
      } else {
        this.special = false;
      }
    }
  }

  // show admin
  showAdmin() {
    if (!isPlatformBrowser(this.platformId)) {
    } else {
      let loggedinUser = this.cookies.get('userToken');

      if (loggedinUser) {
        let userData = JSON.parse(localStorage.getItem('user'));
        this.userName = userData;
      }
    }
  }

  // get id for profile page navigation
  getUserId() {
    if (!isPlatformBrowser(this.platformId)) {
    } else {
      this.loggedInUser = JSON.parse(localStorage.getItem('id'));
    }
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
    //
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

  // check website uses dialog
  checkWebsiteUsesDiag() {
    let temp = this.cookies.get('websiteUsesDiag');
    if (!temp) {
      let sheetRef = this.bottomSheetDiag.open(
        BottomSheetOverviewExampleSheet,
        { backdropClass: 'bgBlur' }
      );

      sheetRef.afterDismissed().subscribe((item) => {
        if (item.save) {
          this.cookies.set('websiteUsesDiag', 'done', 5);
        }
      });
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
    // if (!isPlatformBrowser(this.platformId)) {
    //   return;
    // } else {
    //   // setTimeout(() => {
    //   if (!sessionStorage.getItem('mainPageToast')) {
    //     from(['load'])
    //       .pipe(delay(3000))
    //       .subscribe((item) => {
    //         this.snotifyService.info(
    //           'Welcome User, Search for your fav Movies & TV shows!',
    //           'TheArsonist',
    //           {
    //             timeout: 12000,
    //             showProgressBar: true,
    //             closeOnClick: false,
    //             pauseOnHover: true,
    //             icon: 'assets/images/mylogo.jpg',
    //             buttons: [
    //               {
    //                 text: 'Movies & TV',
    //                 action: () => this.router.navigateByUrl('/movies&tv'),
    //                 bold: false,
    //               },
    //               {
    //                 text: 'Close',
    //                 action: (toast) => {
    //                   this.snotifyService.remove(toast.id);
    //                 },
    //                 bold: true,
    //               },
    //             ],
    //             position: SnotifyPosition.rightBottom,
    //           }
    //         );
    //       });
    //     this.uiService.latestBlog$.pipe(delay(4000)).subscribe((item) => {
    //       if (item) {
    //         console.log(item);
    //         this.snotifyService.success(
    //           `Checkout my latest blog post.... \n
    //           ${item.postTitle}
    //           `,
    //           'TheArsonist',
    //           {
    //             timeout: 12000,
    //             showProgressBar: true,
    //             closeOnClick: false,
    //             pauseOnHover: true,
    //             icon: item.postImage,
    //             buttons: [
    //               {
    //                 text: 'open',
    //                 action: () =>
    //                   this.router.navigateByUrl(
    //                     `/blog/${item.postNumber}/${item.postTitle}/${item._id}`
    //                   ),
    //                 bold: false,
    //               },
    //               {
    //                 text: 'Close',
    //                 action: (toast) => {
    //                   this.snotifyService.remove(toast.id);
    //                 },
    //                 bold: true,
    //               },
    //             ],
    //             position: SnotifyPosition.rightBottom,
    //           }
    //         );
    //       }
    //     });
    //   }
    //   sessionStorage.setItem('mainPageToast', 'notified');
    //   // }, 6000);
    // }
  }

  // show wallpaper from wallpaperPref
  showWalls() {
    if (this.wallpaperNum > 0) {
      $('#bgImg').css({
        'background-image': `url('../../../assets/images/${
          this.wallpapersArr[localStorage.getItem('wallpaperNum')]
        }')`,
      });

      this.picSource = this.picSourceArr[localStorage.getItem('wallpaperNum')];
    } else {
      $('#bgImg').css({
        'background-image': 'none',
      });
      this.picSource = undefined;
    }

    $('.nametag').addClass('pseudo');
  }

  //wallpaper switcher
  switchWalls() {
    if (this.wallpaperNum == 0) {
      this.wallpaperNum += 1;
      localStorage.setItem('wallpaperNum', `${this.wallpaperNum}`);
      this.showWalls();
    } else if (this.wallpaperNum < 4) {
      this.wallpaperNum = this.wallpaperNum + 1;
      localStorage.setItem('wallpaperNum', `${this.wallpaperNum}`);
      this.showWalls();
    } else {
      this.wallpaperNum = 0;
      localStorage.setItem('wallpaperNum', `${this.wallpaperNum}`);
      this.showWalls();
    }
  }

  sitemap = '';
  dynamicRoutes: string[];
  generateSitemap(): void {
    let routes = [];

    this.router.config.forEach((route) => {
      if (route.path && route.path !== '**') {
        routes.push({ path: route.path });
      } else if (route.loadChildren) {
        const childRoutes = Array.isArray(route.loadChildren)
          ? route.loadChildren
          : [route.loadChildren];
        childRoutes.forEach((childRoute: any) => {
          routes.push({ loadChildren: childRoute });
        });
      }
    });

    // const routes: Routes = this.router.config;
    console.log({ routes });
    this.dynamicRoutes = []; // Array to hold dynamically generated routes
    const sitemapUrls: string[] = [];

    routes.forEach((route) => {
      if (route.loadChildren) {
        // If the route is lazy-loaded, load the module and get its routes
        this.router.config.unshift(...route.loadChildren());

        // Remove the loadChildren property so the module is not loaded again
        delete route.loadChildren;
      }

      if (route.path === '**') {
        // Skip wildcard routes
        return;
      }

      if (route.path) {
        // Add the route path to the sitemap
        sitemapUrls.push(`https://krishnakantsalkar.in/${route.path}`);
      }

      if (route.children) {
        // If the route has children, generate the child routes
        this.generateChildRoutes(route.children, route.path || '');
      }
    });

    // Add the dynamically generated routes to the sitemap
    this.dynamicRoutes.forEach((route) =>
      sitemapUrls.push(`https://krishnakantsalkar.in/${route}`)
    );

    // Generate the sitemap XML
    this.sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    this.sitemap +=
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    sitemapUrls.forEach((url) => {
      this.sitemap += `<url><loc>${url}</loc> <changefreq>weekly</changefreq>
      <priority>1.0</priority></url>\n`;
    });

    this.sitemap += '</urlset>\n';

    console.log(this.sitemap);
  }

  generateChildRoutes(routes: Routes, parentPath: string): void {
    routes.forEach((route) => {
      if (route.path) {
        // If the route has a path, add it to the dynamic routes array
        const fullPath = `${parentPath}/${route.path}`;
        this.dynamicRoutes.push(fullPath);
      }

      if (route.children) {
        // If the route has children, generate the child routes
        this.generateChildRoutes(route.children, `${parentPath}/${route.path}`);
      }
    });
  }
}

@Component({
  selector: 'bottom-sheet-dialog',
  templateUrl: './bottom-sheet-dialog.html',
  styleUrls: ['./main-page.component.css'],
})
export class BottomSheetOverviewExampleSheet {
  brightness: boolean;
  constructor(
    private defaultModeService: modeService,
    private bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>
  ) {}

  ngOnInit() {
    // brightness mode
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;
    });
  }

  gotIt() {
    this.bottomSheetRef.dismiss({ save: true });
  }
}
