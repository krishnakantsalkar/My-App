import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  Inject,
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { userloginservices } from 'src/app/Shared/services/userloginservice';
import { IuserLogin } from 'src/app/Shared/model/loginmodel';
import * as AOS from 'aos';
import { CookieService } from 'ngx-cookie-service';
import { Iforgot } from 'src/app/Shared/model/forgotPass';
import { Title } from '@angular/platform-browser';
import { modeService } from '../../../Shared/services/light-dark-Modeservice';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public newLogin: UntypedFormGroup;
  public forgotPass: UntypedFormGroup;
  public brightness: boolean;
  public showpass: boolean;
  public submitted: boolean;

  public ipdata;
  public useragent;
  public userdata;
  public showForgot: boolean;
  public response: any;
  public loginresponse;

  // captcha properties
  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  public theme: 'light' | 'dark';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'en';
  public type: 'image' | 'audio';
  // public readonly siteKey = '6LcEs8IZAAAAAMu2aUYpW3SCLEsV9hmbiS_BD_A0';
  public readonly siteKey = '6LcxNLMaAAAAAEe5bQaXcJqFY0uVAPdRxCYR2JQV'; //oldkeys
  public readonly secretKey = '6LcxNLMaAAAAAM7wvjAbaAg2N6pOmTVk11vwPey1'; //oldkeys
  public captchaTheme;

  public pageTitle = 'Login';

  @ViewChild('loginDialog', { static: false })
  public loginDialog;

  env = environment.production;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private loginservice: userloginservices,
    private cookies: CookieService,
    private cdr: ChangeDetectorRef,
    private titleService: Title,
    private defaultModeService: modeService,
    private dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;
      if (this.brightness === true) {
        this.changeTheme('light');
      } else {
        this.changeTheme('dark');
      }
    });

    this.showpass = false;

    //set page title
    this.titleService.setTitle(this.pageTitle);

    // login formgroup
    this.newLogin = this.fb.group({
      userLogin: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        recaptcha: ['', Validators.required],
      }),
      keepSignedIn: [false],
    });

    // forgot pass formgroup
    this.forgotPass = this.fb.group({
      userLogin: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
      }),
    });
    AOS.init({
      startEvent: 'DOMContentLoaded',
    });

    footerBackground();
    function footerBackground() {
      var footerArea = document.getElementsByClassName(
        'content-new'
      ) as unknown as HTMLCollectionOf<HTMLElement>;
      if (footerArea) {
        footerArea[0].style.position = 'absolute';
      }
    }
  }

  keepSignedInToggle(checked) {
    this.newLogin.patchValue({ keepSignedIn: checked });
  }

  Save(data: IuserLogin) {
    // if (!this.newLogin.valid) {
    //   alert('login details not valid!');
    //   return;
    // }
    let d = document;
    d.getElementById('uploadSpinner').style.display = 'inline-block';
    d.getElementById('uploadCheckErr').style.display = 'none';
    this.loginservice.Login(data).subscribe(
      (item) => {
        if (item && item.token) {
          // localStorage.setItem('userToken', JSON.stringify(item.token));

          if (data.keepSignedIn) {
            let expDate = new Date();
            expDate.setFullYear(expDate.getFullYear() + 1);

            this.cookies.set('userToken', JSON.stringify(item.token), expDate);
          } else {
            this.cookies.set('userToken', JSON.stringify(item.token), 1);
          }
          localStorage.setItem('user', JSON.stringify(item));
          localStorage.setItem('id', JSON.stringify(item.id));
          // localStorage.setItem('userToken', JSON.stringify(item.token));
          localStorage.setItem('profileId', JSON.stringify(item.profileId));
          this.loginresponse = item;
          // let elemnt = document.getElementById('overlay');
          d.getElementById('uploadSpinner').style.display = 'none';
          d.getElementById('uploadCheckErr').style.display = 'none';
          d.getElementById('uploadCheck').style.display = 'inline-block';
          // elemnt.style.zIndex = '3';
          let dialogRes = this.dialog.open(this.loginDialog, {
            // minWidth: '30vw',
            // minHeight: '20vh',
            backdropClass: 'bgBlur',
          });

          dialogRes.afterClosed().subscribe((item) => {
            this.router.navigateByUrl('/home');
          });
        }
      },
      (error) => {
        d.getElementById('uploadSpinner').style.display = 'none';
        d.getElementById('uploadCheckErr').style.display = 'inline-block';
        this.response = error;

        console.log(error);
      }
    );
  }

  logintoHome() {
    this.router.navigateByUrl('/home');
  }

  Forgot(data: Iforgot) {
    if (!this.forgotPass.valid) {
      return;
    }
    this.loginservice.forgotPassMailer(data).subscribe(
      (item) => {
        this.loginresponse = item;
        let elemnt = document.getElementById('overlay');
        elemnt.style.zIndex = '3';
      },
      (error) => {
        this.response = error.error.message;
      }
    );
  }

  switchToForgot() {
    this.showForgot = !this.showForgot;
    this.response = undefined;
  }

  showPass() {
    this.showpass = !this.showpass;
  }

  get f() {
    return this.newLogin.controls;
  }

  off() {
    var elemnt = document.getElementById('overlay');

    elemnt.style.zIndex = '-10';
    this.router.navigateByUrl('/home');
  }

  //captcha logics

  handleReset(): void {
    this.captchaSuccess = false;
    this.captchaResponse = undefined;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();
  }

  handleSuccess(captchaResponse: string): void {
    this.captchaSuccess = true;
    this.captchaResponse = captchaResponse;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();

    let data = {
      secret: this.siteKey,
      response: captchaResponse,
    };
    this.loginservice.verifyRecaptcha(data).subscribe((item) => {});
  }

  handleLoad(): void {
    this.captchaIsLoaded = true;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();
  }

  handleExpire(): void {
    this.captchaSuccess = false;
    this.captchaIsExpired = true;
    this.cdr.detectChanges();
  }

  changeTheme(theme: 'light' | 'dark'): void {
    this.theme = theme;
  }

  changeSize(size: 'compact' | 'normal'): void {
    this.size = size;
  }

  changeType(type: 'image' | 'audio'): void {
    this.type = type;
  }

  // setLanguage(): void {
  //   this.lang = this.langInput.nativeElement.value;
  // }
}
