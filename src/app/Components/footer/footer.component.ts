import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import * as AOS from 'aos';
import { userloginservices } from 'src/app/Shared/services/userloginservice';
import { Router } from '@angular/router';
import { blogpostservice } from 'src/app/Shared/services/blogservice';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { contactService } from '../../Shared/services/contactUSservice';
import { IcontactUs } from '../../Shared/model/contactUsmodel';
import { CookieService } from 'ngx-cookie-service';
import { modeService } from '../../Shared/services/light-dark-Modeservice';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { fromEvent, Subject } from 'rxjs';
import { UiService } from '../../Shared/services/ui.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  public brightness: boolean;
  public recentblogs;
  public loggedInUser;
  public sendFeedback: UntypedFormGroup;
  public logResponse;
  public errResponse;
  public newsLetterForm: UntypedFormGroup;
  public newsLetterSuccess;
  public newsLetterError;
  currentDate: Date = new Date();
  siteVisitors: number;
  countsInterval: number;
  visitorCount: number = 0;
  siteVisitorCalled: boolean = false;
  constructor(
    private loginservice: userloginservices,
    private router: Router,
    private blogservice: blogpostservice,
    private fb: UntypedFormBuilder,
    private contactServices: contactService,
    private cookies: CookieService,
    private defaultModeService: modeService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: any,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    // method calls

    // brightness mode
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;
    });

    if (!isPlatformBrowser(this.platformId)) {
    } else {
      AOS.init({
        startEvent: 'DOMContentLoaded',
      });
      this.recentUpdates();
    }
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

  ngAfterViewInit() {
    if (window && !this.siteVisitorCalled && !this.siteVisitors) {
      window?.addEventListener('scroll', () => {
        this.scrollDetection();
      });
    }
  }

  getUserId() {
    this.loggedInUser = JSON.parse(localStorage.getItem('id'));
  }

  recentUpdates() {
    if (this.blogservice.recentBlogCache.get('recentBlogs')) {
      this.recentblogs = this.blogservice.recentBlogCache.get('recentBlogs');
    } else {
      this.blogservice.getRecentPosts().subscribe((item) => {
        this.recentblogs = item.result;

        this.uiService.latestBlog$.next(this.recentblogs[0]);

        this.blogservice.recentBlogCache.set('recentBlogs', this.recentblogs);
      });
    }
  }

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
        let elemnt = document.getElementById('overlayFooter');
        elemnt.style.zIndex = '3';
        d.getElementById('uploadSpinner2').style.display = 'none';
        d.getElementById('uploadCheckErr2').style.display = 'none';
        d.getElementById('uploadCheck2').style.display = 'inline-block';
      },
      (error) => {
        this.errResponse = error.error;
        let elemnt = document.getElementById('overlayFooter');
        elemnt.style.zIndex = '3';
        d.getElementById('uploadSpinner2').style.display = 'none';
        d.getElementById('uploadCheckErr2').style.display = 'inline-block';
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

  // scroll to top
  topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getSiteVisitor() {
    this.loginservice.getSiteVisitor().subscribe((item) => {
      this.siteVisitors = item.result;
      this.visitorCount = 0;
      if (this.siteVisitors > 0) {
        this.countsInterval = setInterval(() => {
          this.visitorCount += 1;
          if (this.visitorCount === this.siteVisitors) {
            clearInterval(this.countsInterval);
          }
        });
      }
    });
  }

  scrollDetection() {
    if (
      (document?.body?.scrollTop > 300 ||
        document?.documentElement?.scrollTop > 300) &&
      !this.visitorCount &&
      !this.siteVisitorCalled
    ) {
      this.siteVisitorCalled = true;
      this.getSiteVisitor();
    } else {
      return;
    }
  }
}
