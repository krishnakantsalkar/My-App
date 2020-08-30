import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { blogpostservice } from 'src/app/Shared/services/blogservice';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { clientIpService } from '../../../Shared/services/clientip-service';
import { userIp } from '../../../Shared/model/userViewModel';

@Component({
  selector: 'app-blogposts',
  templateUrl: './blogposts.component.html',
  styleUrls: ['./blogposts.component.css'],
})
export class BlogpostsComponent implements OnInit {
  public brightness: boolean;
  public data;
  public url; // dom sanitizer url
  public edit: boolean;
  public checkUser; //check user logged in
  public switchtoedit: boolean; //switch edit > blog panel

  public newEdit: FormGroup; // update by Id method

  post;
  public adminName;
  public blogURL;
  public userIpObj;
  public postId;
  constructor(
    private blogservice: blogpostservice,
    private AR: ActivatedRoute,
    private sanitizer: DomSanitizer, // to sanitize urls , method below
    private fb: FormBuilder,
    private router: Router,
    private cookies: CookieService,
    private clientIpObj: clientIpService
  ) {}

  ngOnInit(): void {
    this.mode(); // dark-light mode toggle

    this.checkUserPresent();

    this.showAdmin();

    // AOS animation
    AOS.init({
      startEvent: 'DOMContentLoaded',
    });

    //Activated Routing
    this.AR.params.subscribe((item) => {
      let id = item['id'];
      this.blogservice.getBlogsbyId(id).subscribe((items) => {
        this.data = items;
        this.post = this.data.post;
        this.blogURL = window.location.href;
        if (this.data.postLink.length > 3) {
          this.url = this.data.postLink;
        }
        this.clientIpObj.getClientIp().subscribe((ipObj: userIp) => {
          let ip = ipObj.ip;
          this.postId = window.location.href.split('/');
          this.blogservice
            .trackPostViews(this.postId[4], ip)
            .subscribe((response) => {});
        });
      });
    });

    // reactive form method
    this.newEdit = this.fb.group({
      postTitle: [''],
      post: [''],
      postLink: [''],
      edited: ['true'], // send a default edited = true on every API call (since its edited)!
    });

    //Get the button
    var mybutton = document.getElementById('myBtn');
    let mediaQ = window.matchMedia('(max-width: 600px)');

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function () {
      scrollFunction();
      scrollFunctionMedia(mediaQ);
    };

    function scrollFunction() {
      if (
        document.body.scrollTop > 50 ||
        document.documentElement.scrollTop > 50
      ) {
        mybutton.style.display = 'block';
        document.getElementById('top-panel').style.height = '60px';
        document.getElementById('top-panel').style.transitionDuration = '0.2s';
        document.getElementById('top-panel').style.transitionTimingFunction =
          'ease-in';
        document.getElementById('top-panel-nametag').style.paddingTop = '10px';
        document.getElementById('links').style.marginTop = '0px';
        document.getElementById('links').style.padding = '11px';
      } else {
        mybutton.style.display = 'none';
        document.getElementById('top-panel').style.height = '90px';
        document.getElementById('top-panel-nametag').style.paddingTop = '25px';
        document.getElementById('links').style.marginTop = '10px';
        document.getElementById('links').style.padding = '15px';
      }
    }

    function scrollFunctionMedia(mediaQuery) {
      if (
        (mediaQuery.matches && document.body.scrollTop > 50) ||
        (mediaQuery.matches && document.documentElement.scrollTop > 50)
      ) {
        document.getElementById('top-panel').style.height = '85px';
        document.getElementById('top-panel').style.transitionDuration = '0.2s';
        document.getElementById('top-panel').style.transitionTimingFunction =
          'ease-in';
        document.getElementById('top-panel-nametag').style.paddingTop = '15px';
        document.getElementById('links').style.marginTop = '-15px';
      } else if (
        (mediaQuery.matches && document.body.scrollTop < 50) ||
        (mediaQuery.matches && document.documentElement.scrollTop < 50)
      ) {
        document.getElementById('top-panel').style.height = '110px';
        document.getElementById('top-panel-nametag').style.paddingTop = '25px';
        document.getElementById('links').style.marginTop = '-5px';
      }
    }
  }

  //sanitize url method
  getLink(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.url);
  }

  //dark-light mode
  mode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }

  //enable edit mode
  editmode() {
    this.edit = !this.edit;
  }

  //check if user logged in
  checkUserPresent() {
    // this.checkUser = localStorage.getItem('credentials');
    this.checkUser = this.cookies.get('credentials');
    if (!this.checkUser) {
    }
  }

  //method to display either edit mode or blog post panel
  switchToEdit() {
    this.switchtoedit = !this.switchtoedit;
  }

  //edit post by id [4], here id = [5] because the array elements are higher in the deployed page
  editPostById(data) {
    let getBlogId = window.location.href.split('/');
    let id = getBlogId[4];
    this.blogservice.updateBlog(data, id).subscribe(
      (item) => {
        alert(item.message);
        location.reload();
      },
      (err) => {
        alert(err.message);
      }
    );
  }

  //delete post by id
  deletePostById() {
    let getBlogId = window.location.href.split('/');
    let id = getBlogId[4];
    this.blogservice.deleteBlog(id).subscribe(
      (item) => {
        alert(item.message);
        this.router.navigateByUrl('/Blog/page/1');
      },
      (err) => {
        alert(err.message);
      }
    );
  }

  showAdmin() {
    let currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) {
      return;
    }
    this.adminName = currentUser.name;
  }
  topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
