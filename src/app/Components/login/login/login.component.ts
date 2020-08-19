import { Component, OnInit } from '@angular/core';
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
  public userdata = [this.ipdata, this.useragent];
  public showForgot: boolean;
  public response: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginservice: userloginservices,
    private userlogservice: clientIpService,
    private cookies: CookieService
  ) {}

  ngOnInit(): void {
    this.mode();
    this.showpass = false;

    // login formgroup
    this.newLogin = this.fb.group({
      userLogin: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        userip: [''],
        useragent: [''],
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
      // console.log(this.ipdata, this.useragent);
      this.newLogin.patchValue({
        userLogin: {
          userip: JSON.stringify(this.ipdata),
          useragent: JSON.stringify(this.useragent),
        },
      });
    });
  }

  Save(data: IuserLogin) {
    if (!this.newLogin.valid) {
      // if login form not valid , return
      return;
    }
    // console.log(data);
    this.loginservice.Login(data).subscribe(
      (item) => {
        if (item && item.token === true) {
          // localStorage.setItem('credentials', JSON.stringify(item.token));
          this.cookies.set('credentials', JSON.stringify(item.token), 1);
          localStorage.setItem('user', JSON.stringify(item));
          localStorage.setItem('id', JSON.stringify(item.id));
        }
        alert('login successful!');
        this.router.navigateByUrl('/Home');
        // console.log(item);
      },
      (error) => {
        this.response = error.error.message;
      }
    );
  }

  Forgot(data: Iforgot) {
    if (!this.forgotPass.valid) {
      return;
    }
    this.loginservice.forgotPassMailer(data).subscribe(
      (item) => {
        alert(item.message);
        this.router.navigateByUrl('/Home');
      },
      (error) => {
        this.response = error.error.message;
      }
    );
  }

  switchToForgot() {
    this.showForgot = !this.showForgot;
  }

  mode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }

  showPass() {
    this.showpass = !this.showpass;
  }

  get f() {
    return this.newLogin.controls;
  }
}
