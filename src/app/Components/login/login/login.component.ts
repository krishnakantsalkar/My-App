import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { userloginservices } from 'src/app/Shared/services/userloginservice';
import { IuserLogin } from 'src/app/Shared/model/loginmodel';
import * as AOS from 'aos';
import { clientIpService } from 'src/app/Shared/services/clientip-service';
import { CookieService } from 'ngx-cookie-service';
import { Iforgot } from 'src/app/Shared/model/forgotPass';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public newLogin: FormGroup;
  public forgotPass: FormGroup;
  public brightness: boolean;
  public showpass: boolean;
  public submitted: boolean;

  public ipdata;
  public useragent;
  public userdata
  public showForgot: boolean;
  public response: any;
  public loginresponse;

  // captcha properties
  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'en';
  public type: 'image' | 'audio';
  public readonly siteKey = '6LcEs8IZAAAAAMu2aUYpW3SCLEsV9hmbiS_BD_A0';
  public captchaTheme;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginservice: userloginservices,
    private userlogservice: clientIpService,
    private cookies: CookieService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.mode();
    this.showpass = false;
    this.changeTheme(this.captchaTheme);

    // login formgroup
    this.newLogin = this.fb.group({
      userLogin: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        userip: [''],
        useragent: [''],
        recaptcha: ['', Validators.required],
      }),
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

    this.userlogservice.getClientIp().subscribe((item) => {
      this.ipdata = item;
      this.useragent = { useragent: window.navigator.userAgent };
      this.newLogin.patchValue({
        userLogin: {
          userip: this.ipdata,
          useragent: this.useragent,
        },
      });
    });

    footerBackground();
    function footerBackground() {
      var footerArea = (document.getElementsByClassName(
        'content-new'
      ) as unknown) as HTMLCollectionOf<HTMLElement>;
      if (footerArea) {
        footerArea[0].style.position = 'absolute';
      }
    }
  }

  Save(data: IuserLogin) {
    if (!this.newLogin.valid) {
      return;
    }
    this.loginservice.Login(data).subscribe(
      (item) => {
        if (item && item.token) {
          // localStorage.setItem('credentials', JSON.stringify(item.token));
          this.cookies.set('credentials', JSON.stringify(item.token), 5);
          localStorage.setItem('user', JSON.stringify(item));
          localStorage.setItem('id', JSON.stringify(item.id));
          this.loginresponse = item;
          let elemnt = document.getElementById('overlay');
          elemnt.style.zIndex = '3';
        }
      },
      (error) => {
        this.response = error.error.message;
      }
    );

    // disable brightness toggle
    $(document).ready(() => {
      $('.modeLD a').css('pointer-events', 'none');
      $('.modeLD a').css('opacity', 0.4);
    });
  }

  logintoHome() {
    this.router.navigateByUrl('/Home');
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

  mode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
    if (this.brightness === true) {
      this.captchaTheme = 'light';
    } else {
      this.captchaTheme = 'dark';
    }
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
    this.router.navigateByUrl('/Home');
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
