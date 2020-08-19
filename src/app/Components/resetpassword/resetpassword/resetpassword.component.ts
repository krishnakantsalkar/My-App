import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as AOS from 'aos';
import { userloginservices } from 'src/app/Shared/services/userloginservice';
import { Iforgot } from '../../../Shared/model/forgotPass';
import { Router } from '@angular/router';

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
  constructor(
    private fb: FormBuilder,
    private loginServices: userloginservices,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.mode();
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
    let getUrl = window.location.href.split('/');
    this.loginServices.resetPass(data, getUrl[4]).subscribe(
      (item) => {
        alert(item.message);
        this.router.navigateByUrl('/Login');
      },
      (error) => {
        this.response = error.error.message;
      }
    );
  }

  mode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }

  showPass() {
    this.showpass = !this.showpass;
  }
}
