import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as AOS from 'aos';
import { blogpostservice } from 'src/app/Shared/services/blogservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Iblog } from 'src/app/Shared/model/blogmodel';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { IsearchResult } from 'src/app/Shared/model/searchResult';
import * as superplaceholder from 'superplaceholder';
import { Meta, Title } from '@angular/platform-browser';
import * as readingTime from 'reading-time';
import { modeService } from '../../../Shared/services/light-dark-Modeservice';

var movieQuotesJson = require('../../../../assets/movie-quotes.json');

import { ConfirmationService } from 'primeng/api';
import 'quill-emoji/dist/quill-emoji.js';
import * as moment from 'moment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
  providers: [ConfirmationService],
})
export class BlogComponent implements OnInit {
  public brightness: boolean;
  public date = new Date();

  public data;
  public allData;

  public checkUser;

  public createPost: boolean;

  public newPost: FormGroup;
  public newSearch: FormGroup;
  public currentBlogImgP;
  public currentBlogImg;
  public storeBlogImg;
  public pageNo;
  public datacount: number;
  public searchResult;
  public logResponse;
  public errResponse;
  public blogURL;
  public postNumVal;

  public showSearchBtn: boolean;

  public pageTitle = 'Blog';

  public readTimeCheck = [];
  public totalWordsCheck = [];
  // markdown impl.
  public markdown;

  public year;
  public showYear: boolean = true;
  public showAll: boolean = true;
  public pageYear;

  public movieName;
  public movieQ;
  public movieQArr;

  public months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  display: boolean = false;
  display2: boolean = false;

  config = {
    'emoji-toolbar': true,
    'emoji-textarea': true,
    'emoji-shortname': true,
  };

  public blogErrMsg;
  public scrollbarOptions = { axis: 'yx', theme: 'minimal-dark' };

  postLinks: any[] = [];
  pgSize: number;
  public today = new Date();
  moment = moment;

  @ViewChild('blogPostDialog', { static: false })
  blogPostDialog: TemplateRef<any>;

  constructor(
    private blogservice: blogpostservice,
    private fb: FormBuilder,
    private router: Router,
    private cookies: CookieService,
    private titleService: Title,
    private defaultModeService: modeService,
    private confirmationService: ConfirmationService,
    private meta: Meta,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // method calls

    this.meta.updateTag({ property: 'og:type', content: 'blog' });
    this.meta.updateTag({ property: 'og:title', content: 'Blog' });
    this.meta.updateTag({ property: 'og:url', content: window.location.href });
    this.meta.updateTag({
      property: 'og:site_name',
      content: 'https://krishnakantsalkar.in',
    });
    this.meta.updateTag({
      property: 'og:image',
      content:
        'https://res.cloudinary.com/dq766ltjh/image/upload/v1603720093/blog%20cover/Adobe_Post_20200807_1743590.23573714086058384_h83kqo.jpg',
    });
    this.meta.updateTag({ property: 'og:width', content: '1200' });

    this.meta.updateTag({ property: 'og:height', content: '630' });

    // brightness mode
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;
    });

    // activated routing hax
    let pageRouting = window.location.href.split('/');
    this.blogsP(pageRouting[4]);

    // check admin
    this.checkUserPresent();

    // set page title
    this.titleService.setTitle(this.pageTitle);

    // // get all blogs
    this.blogs();

    // aos animation
    AOS.init({
      startEvent: 'DOMContentLoaded',
    });

    // blog post reactive form
    this.newPost = this.fb.group({
      postImage: [''],
      postNumber: ['', [Validators.required]],
      postTitle: ['', Validators.required],
      post: [''],
      postAuthor: [''],
    });

    this.addLink();

    // set value for postAuthor
    let adminUser: any = JSON.parse(localStorage.getItem('user'));
    if (adminUser) {
      let adminName = `${adminUser.name} ${adminUser.surname}`;
      this.newPost.patchValue({
        postAuthor: `${adminName}`,
      });
      let mon = new Date().getMonth();
    }

    // blog searach
    this.newSearch = this.fb.group({
      post: [''],
    });

    // animated placeholder text
    superplaceholder({
      el: document.getElementById('searchbar'),
      sentences: [
        'roms..',
        'pixel experience..',
        'coronavirus..',
        'corvus..',
        'search something..',
        'henlo fren..',
      ],
      options: {
        shuffle: true,
        cursor: '$',
        autoStart: true,
      },
    });

    $(() => {
      $('.showYears').hide();
      $('.showArrow').css({ opacity: 0 });
      $('.showYearOpt').hide();
    });

    //get movie quotes
    this.getMovieQuotes();

    //take from post cache
    if (localStorage.getItem('postCache')) {
      let cache = JSON.parse(localStorage.getItem('postCache'));
      this.newPost.patchValue({ postTitle: cache.postTitle });
      this.markdown = cache.post;
      this.postLinks = cache.postLinks;
    }
  }

  // get all blogs
  blogs() {
    this.blogservice.getBlogs().subscribe((item) => {
      this.allData = item;
    });
  }

  // get blogs by pagination
  blogsP(pg, year?) {
    if (year) {
      this.year = year;
    }
    this.blogservice.getBlogsP(pg, this.year).subscribe((item) => {
      // blogURL for share btns
      this.blogURL = null;
      this.blogURL = window.location.href;

      this.pgSize = item.pageSize;
      this.data = item.dataSize;
      this.datacount = item.dataCount;
      this.postNumVal = this.datacount;

      // set postNumber based on incoming blog postNumber
      this.setPostNum();

      //get approx blog post read time
      this.getreadTime();
      this.router.navigateByUrl(`/blog/${pg}`).then(() => {
        if (pg > 1) {
          window.scrollTo({ left: 0, top: 400, behavior: 'smooth' });
        }
      });
    });

    this.pageYear = year;
    this.pageNo = pg;
  }

  clearYear() {
    this.year = undefined;
    this.showYearList();
    this.showAllList();
    this.blogsP(1);
  }

  // set post Number dynamically
  setPostNum() {
    this.newPost.patchValue({ postNumber: this.datacount + 1 });
  }

  // check if admin present
  checkUserPresent() {
    this.checkUser = this.cookies.get('credentials');
    if (!this.checkUser) {
    }
  }

  // hide & show create post window
  createPostmethod() {
    this.createPost = !this.createPost;
  }

  // upload img live preview
  selection(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.currentBlogImgP = event.target.result; // current blog img Preview
      };
      const file = event.target.files[0];
      this.currentBlogImg = file; // main blog image file
    }
  }

  // submit post method
  submitAll() {
    this.blogErrMsg = undefined;
    if (!this.currentBlogImg) {
      this.blogErrMsg = '*error: Post Image is required !';
      return;
    }
    let postBindedData = this.markdown;

    this.newPost.patchValue({ post: postBindedData });

    this.SubmitPost(this.newPost.value);

    // post to telegram method, broken as of now
    // this.channelPost(this.newPost.value);
  }

  // submit form method !!! MAIN !!!
  SubmitPost(data: Iblog) {
    if (!this.newPost.valid) {
      this.errResponse = 'Required fields cannot be empty*';
      return;
    }

    const formData = new FormData();

    // visual feedback
    let d = document;
    d.getElementById('uploadSpinner').style.display = 'inline-block';

    // form data element for blog image since files can't be sent via json
    formData.append('postImage', this.currentBlogImg);
    this.blogservice.uploadImg(formData).subscribe(async (item) => {
      this.storeBlogImg = await item.result;

      // upload image first and get the uploaded file link back from API
      if (this.storeBlogImg) {
        this.newPost.patchValue({
          postImage: this.storeBlogImg['postImage'],
        });

        // blog post API call
        let data = this.newPost.value;
        let linksArr = [];
        this.postLinks.forEach((x) => {
          linksArr.push(x.link);
        });
        data.postLinks = linksArr;
        this.blogservice.publishBlog(data).subscribe(
          (item2) => {
            this.logResponse = item2.result;
            d.getElementById('uploadCheck').style.display = 'inline-block';
            d.getElementById('uploadSpinner').style.display = 'none';

            localStorage.removeItem('postCache');

            let dialogRes = this.dialog.open(this.blogPostDialog, {
              minHeight: '20vh',
              minWidth: '30vw',
            });

            dialogRes.afterClosed().subscribe((item) => {
              this.createPost = !this.createPost;

              this.router.navigateByUrl('/blog/1');
            });
          },
          (err) => {
            d.getElementById('uploadCheck').style.display = 'none';
            d.getElementById('uploadSpinner').style.display = 'none';
            this.errResponse = err.error;
            this.display = true;
          }
        );
      }
    });
  }

  // remove notification overlay method by clicking anywhere
  off() {
    this.ngOnInit();
  }

  // confirm() {
  //   this.confirmationService.confirm({
  //     message: 'Would you like to publish this?',
  //     accept: () => {
  //       this.confirmPost();
  //     },
  //     reject: () => {
  //       this.cancelPost();
  //     },
  //   });
  // }

  // confirm post
  confirmPost() {
    this.submitAll();
  }

  // cancel post
  cancelPost() {
    let d = document;
    d.getElementById('uploadSpinner2').style.display = 'none';
    d.getElementById('uploadCheck').style.display = 'none';

    return;
  }

  // upload image method
  SubmitFile() {}

  // post to telegram channel, Method broken as of now!
  // channelPost(data) {
  //   let title = data.postTitle;
  //   let post = data.post;
  //   this.blogservice.tgpost(title, post).subscribe((item) => {});
  // }

  // show & hide search method
  showsearch() {
    this.showSearchBtn = !this.showSearchBtn;
    if (this.showSearchBtn) {
      $('#input-container').show(300);
    } else if (!this.showSearchBtn) {
      $('#input-container').hide(300);
    }
  }

  //search method api
  Search(data: string) {
    if (data) {
      this.blogservice.searchBlog(data).subscribe((item) => {
        this.searchResult = item.data;
        document
          .getElementById('twothousandtwenty')
          .scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  // clear search result
  cancel() {
    this.searchResult = null;
  }

  // navigate to post author
  gotoAuthor() {
    this.router.navigateByUrl('/about#developer');
  }

  // get blog post approx read time
  getreadTime() {
    // make old value null first
    this.readTimeCheck.length = 0;
    this.totalWordsCheck.length = 0;

    // loop through data
    for (let d of this.data) {
      let totalReadTime = readingTime(d.post);
      this.readTimeCheck.push(totalReadTime.text);
      this.totalWordsCheck.push(totalReadTime.words);
    }
  }

  showYearList() {
    this.showYear = !this.showYear;

    if (this.showYear) {
      $('.showYears').hide(300);
      $('.showArrow').css({ opacity: 0, transition: '0.3s ease-in' });
    } else if (!this.showYear) {
      $('.showYears').show(300);
      $('.showArrow').css({ opacity: 1, transition: '0.3s ease-in' });
    }
  }

  showAllList() {
    this.showAll = !this.showAll;
    if (this.showAll) {
      $('.showYearOpt').hide(300);
      $('.showYears').hide(300);
      $('.showArrow').css({ opacity: 0, transition: '0.3s ease-in' });
      this.showYear = !this.showYear;
    } else if (!this.showAll) {
      $('.showYearOpt').show(300);
    }
  }

  getMovieQuotes() {
    this.movieQArr = movieQuotesJson;
    let random = Math.floor(Math.random() * this.movieQArr.length);

    this.movieQ = this.movieQArr[random].quote;
    this.movieName = this.movieQArr[random].movie;
  }

  addLink() {
    this.postLinks.push({ link: '' });
  }
  removeLink(i) {
    this.postLinks.splice(i, 1);
  }

  //cache post data

  cachePost() {
    if (localStorage.getItem('postCache')) {
      let cache = JSON.parse(localStorage.getItem('postCache'));

      cache.postTitle = this.newPost.value.postTitle;
      cache.post = this.markdown;
      cache.postLinks = this.postLinks;

      localStorage.setItem('postCache', JSON.stringify(cache));
    } else {
      let cache = {
        postTitle: this.newPost.value.postTitle,
        post: this.markdown,
        postLinks: this.postLinks,
      };

      localStorage.setItem('postCache', JSON.stringify(cache));
    }
  }
}
