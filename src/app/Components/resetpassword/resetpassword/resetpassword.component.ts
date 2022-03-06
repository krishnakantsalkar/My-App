import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as AOS from 'aos';
import { userloginservices } from 'src/app/Shared/services/userloginservice';
import { Iforgot } from '../../../Shared/model/forgotPass';
import { Router } from '@angular/router';
import { modeService } from '../../../Shared/services/light-dark-Modeservice';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css'],
})
export class ResetpasswordComponent implements OnInit {
  public resetForm: FormGroup;
  public brightness: boolean;
  public showpass: boolean;
  public submitted: boolean;
  public response: any;
  public logResponse;
  constructor(
    private fb: FormBuilder,
    private loginServices: userloginservices,
    private router: Router,
    private defaultModeService: modeService
  ) {}

  ngOnInit(): void {
    // brightness mode
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;
    });

    this.showpass = false;

    this.resetForm = this.fb.group({
      userLogin: this.fb.group({
        password: ['', [Validators.required, Validators.min(5)]],
        repassword: ['', [Validators.required, Validators.min(5)]],
      }),
    });

    AOS.init({
      startEvent: 'DOMContentLoaded',
    });
  }

  Reset(data: Iforgot) {
    if (!this.resetForm.valid) {
      return;
    }
    let p1 = this.resetForm.get('userLogin.password').value;
    let p2 = this.resetForm.get('userLogin.repassword').value;
    if (p1 != p2) {
      this.response = ' Passwords dont match! ';
      return;
    }
    // let getUrl = window.location.href.split('/');
    let getUrl = `${environment.baseUrl}${this.router.url}`.split('/');

    this.loginServices.resetPass(data, getUrl[4]).subscribe(
      (item) => {
        this.logResponse = item;
        let elemnt = document.getElementById('overlay');
        elemnt.style.zIndex = '3';
      },
      (error) => {
        this.response = error.error.message;
      }
    );
  }
  logintoHome() {
    this.router.navigateByUrl('/login');
  }

  off() {
    var elemnt = document.getElementById('overlay');

    elemnt.style.zIndex = '-10';
    this.router.navigateByUrl('/login');
  }

  showPass() {
    this.showpass = !this.showpass;
  }
}
