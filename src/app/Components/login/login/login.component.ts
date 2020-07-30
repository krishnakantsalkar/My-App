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
import { clientIpService } from '../../../Shared/services/clientip-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public newLogin: FormGroup;
  public brightness: boolean;
  public showpass: boolean;
  public submitted: boolean;

  public ipdata;
  public useragent;
  public userdata = [this.ipdata, this.useragent];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginservice: userloginservices,
    private userlogservice: clientIpService
  ) {}

  ngOnInit(): void {
    this.mode();
    this.showpass = false;
    this.newLogin = this.fb.group({
      userLogin: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        userip: [''],
        useragent: [''],
      }),
    });
    AOS.init({
      startEvent: 'DOMContentLoaded',
    });

    this.userlogservice.getClientIp().subscribe((item) => {
      this.ipdata = item;
      this.useragent = { useragent: window.navigator.userAgent };
      console.log(this.ipdata, this.useragent);
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
    console.log(data);
    this.loginservice.Login(data).subscribe((item) => {
      if (item && item.token === true) {
        localStorage.setItem('credentials', JSON.stringify(item.token));
        localStorage.setItem('user', JSON.stringify(item));
        localStorage.setItem('id', JSON.stringify(item.id));
      }
      alert('login successful!');
      this.router.navigateByUrl('/Home');
      console.log(item);
    });
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
