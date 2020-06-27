import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { userloginservices } from 'src/app/Shared/services/userloginservice';
import { IuserLogin } from 'src/app/Shared/model/loginmodel';
import * as AOS from 'aos';

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
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginservice: userloginservices
  ) {}

  ngOnInit(): void {
    this.mode();
    this.showpass = false;
    this.newLogin = this.fb.group({
      userLogin: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
      }),
    });
    AOS.init({
      startEvent: 'DOMContentLoaded',
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
