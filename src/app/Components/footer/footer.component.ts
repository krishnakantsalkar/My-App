import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { userloginservices } from 'src/app/Shared/services/userloginservice';
import { Router } from '@angular/router';
import { blogpostservice } from 'src/app/Shared/services/blogservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { contactService } from '../../Shared/services/contactUSservice';
import { IcontactUs } from '../../Shared/model/contactUsmodel';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  public brightness: boolean;
  public recentblogs;
  public loggedInUser;
  public sendFeedback: FormGroup;
  public logResponse;
  public errResponse;
  public newsLetterForm: FormGroup;
  public newsLetterSuccess;
  public newsLetterError;

  constructor(
    private loginservice: userloginservices,
    private router: Router,
    private blogservice: blogpostservice,
    private fb: FormBuilder,
    private contactServices: contactService,
    private cookies: CookieService
  ) {}

  ngOnInit(): void {
    this.defaultmode();
    AOS.init({
      startEvent: 'DOMContentLoaded',
    });
    this.recentUpdates();

    // feedback form
    this.sendFeedback = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.min(5)]],
    });

    // newsletter form
    this.newsLetterForm = this.fb.group({
      userEmail: ['', [Validators.required, Validators.email]],
    });
  }

  defaultmode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }

  getUserId() {
    this.loggedInUser = JSON.parse(localStorage.getItem('id'));
  }

  recentUpdates() {
    this.blogservice.getBlogs().subscribe((item) => {
      this.recentblogs = item;
    });
  }

  Send(data: IcontactUs) {
    if (!this.sendFeedback.valid) {
      return;
    }
    let d = document
    d.getElementById('uploadSpinner2').style.display='inline-block'
    d.getElementById('uploadCheckErr2').style.display='none'
    this.contactServices.contact(data).subscribe(
      (item) => {
        this.logResponse = item;
        let elemnt = document.getElementById('overlayFooter');
        elemnt.style.zIndex = '3';
        d.getElementById('uploadSpinner2').style.display='none'
        d.getElementById('uploadCheckErr2').style.display='none'
        d.getElementById('uploadCheck2').style.display='inline-block'
      },
      (error) => {
        this.errResponse = error.error;
        let elemnt = document.getElementById('overlayFooter');
        elemnt.style.zIndex = '3';
        d.getElementById('uploadSpinner2').style.display='none'
        d.getElementById('uploadCheckErr2').style.display='inline-block'
      }
    );
  }

  off() {
    var elemnt = document.getElementById('overlayFooter');

    elemnt.style.zIndex = '-10';
    location.reload();
  }

  //newsLetter Subscribe
  subscribeNewsLetter(data) {
    if (!this.newsLetterForm.valid) {
      return;
    }
    let d = document
    d.getElementById('uploadSpinner1').style.display='inline-block'
    d.getElementById('uploadCheckErr1').style.display='none'
    this.blogservice.subscribeNewsLetter(data).subscribe(
      (item) => {
        this.newsLetterSuccess = item;
        d.getElementById('uploadSpinner1').style.display='none'
        d.getElementById('uploadCheckErr1').style.display='none'
        d.getElementById('uploadCheck1').style.display='inline-block'
      },
      (err) => {
        this.newsLetterError = err.error.message;
        d.getElementById('uploadSpinner1').style.display='none'
        d.getElementById('uploadCheckErr1').style.display='inline-block'
      }
    );
  }

  // scroll to topg
  topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
