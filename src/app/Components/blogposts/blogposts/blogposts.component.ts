import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { blogpostservice } from 'src/app/Shared/services/blogservice';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  constructor(
    private blogservice: blogpostservice,
    private AR: ActivatedRoute,
    private sanitizer: DomSanitizer, // to sanitize urls , method below
    private fb: FormBuilder,
    private router: Router
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

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function () {
      scrollFunction();
    };

    function scrollFunction() {
      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        mybutton.style.display = 'block';
      } else {
        mybutton.style.display = 'none';
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
    this.checkUser = localStorage.getItem('credentials');
    if (!this.checkUser) {
      console.log('user not logged in');
    }
  }

  //method to display either edit mode or blog post panel
  switchToEdit() {
    this.switchtoedit = !this.switchtoedit;
  }

  //edit post by id [4], here id = [5] because the array elements are higher in the deployed page
  editPostById(data) {
    let getBlogId = window.location.href.split('/');
    let id = getBlogId[5];
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
        this.router.navigateByUrl('/Blog');
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
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}
