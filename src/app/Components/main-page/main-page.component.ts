import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { userloginservices } from 'src/app/Shared/services/userloginservice';
import { Router } from '@angular/router';
import { blogpostservice } from 'src/app/Shared/services/blogservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { contactService } from '../../Shared/services/contactUSservice';
import { IcontactUs } from '../../Shared/model/contactUsmodel';

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
  constructor(
    private loginservice: userloginservices,
    private router: Router,
    private blogservice: blogpostservice,
    private fb: FormBuilder,
    private contactServices: contactService
  ) {}

  ngOnInit(): void {
    this.defaultmode();
    this.getspecials();
    AOS.init({
      startEvent: 'DOMContentLoaded',
    });
    this.recentUpdates();
    this.getUserId();

    this.sendFeedback = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.min(2)]],
    });
  }

  mode() {
    this.brightness = !this.brightness;
    localStorage.setItem('mode', JSON.stringify(this.brightness));
  }
  defaultmode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }

  getspecials() {
    let temp = JSON.parse(localStorage.getItem('credentials'));
    if (temp === true) {
      this.special = true;
    } else {
      this.special = false;
    }
    console.log(this.special);
  }

  logout() {
    localStorage.removeItem('credentials');
    localStorage.removeItem('id');
    location.reload();
  }

  recentUpdates() {
    this.blogservice.getBlogs().subscribe((item) => {
      this.recentblogs = item;
    });
  }

  getUserId() {
    this.loggedInUser = JSON.parse(localStorage.getItem('id'));
  }

  Send(data: IcontactUs) {
    if (!this.sendFeedback.valid) {
      return;
    }
    console.log(data);
    this.contactServices.contact(data).subscribe(
      (item) => {
        alert('message sent successfully!');
        location.reload();
      },
      (error) => {
        alert('somethng went wrong, please try again');
      }
    );
  }
}
