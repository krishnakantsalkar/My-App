import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { blogpostservice } from 'src/app/Shared/services/blogservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Iblog } from 'src/app/Shared/model/blogmodel';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpParams } from '@angular/common/http';
import { IsearchResult } from 'src/app/Shared/model/searchResult';
import * as superplaceholder from 'superplaceholder';
import { Title } from '@angular/platform-browser';
import * as readingTime from 'reading-time'

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
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

  public pageTitle = 'Blog'

  public readTimeCheck = []
  public totalWordsCheck = []
  // markdown impl.
  public markdown = `## Enter content in Markdown format __here__!
  ---`;

  constructor(
    private blogservice: blogpostservice,
    private fb: FormBuilder,
    private router: Router,
    private cookies: CookieService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    // method calls
    this.mode();
    let pageRouting = window.location.href.split('/')  
    this.blogsP(pageRouting[4]);
    this.checkUserPresent();

    // set page title
    this.titleService.setTitle(this.pageTitle)

    // get all blogs
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
      postLink: [''],
      postLink2: [''],
      postLink3: [''],
      postLink4: [''],
      postAuthor: [''],
    });

    // set value for postAuthor
    let adminUser: any = JSON.parse(localStorage.getItem('user'));
    if (adminUser) {
      let adminName = `${adminUser.name} ${adminUser.surname}`;
      this.newPost.patchValue({
        postAuthor: `${adminName}`,
      });
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

    $(document).ready(() => {
      $('.modeLD a').css('pointer-events', 'none');
      $('.modeLD a').css('opacity', 0.4);
    });
  }

  // light & dark mode
  mode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }

  // get all blogs
  blogs() {
    this.blogservice.getBlogs().subscribe((item) => {
      this.allData = item;
    });
  }

  // get blogs by pagination
  blogsP(pg) {
    this.blogservice.getBlogsP(pg).subscribe((item) => {
    // blogURL for share btns
    this.blogURL = null
    this.blogURL = window.location.href;
    

      this.data = item.dataSize;
      this.datacount = item.dataCount;
      this.postNumVal = this.datacount;
      this.setPostNum();

      //get approx blog post read time
      this.getreadTime()
      this.router.navigateByUrl(`/Blog/${pg}`).then(() => {
        // var elmnt = document.getElementById('scrolldata');
        // if (elmnt) {
        //   elmnt.scrollIntoView();
        // }
      if(pg > 1){
        window.scrollTo({left:0, top:400, behavior:"smooth"})
      } });
    });
    this.pageNo = pg;
  }

  // set post Number dynamically
  setPostNum() {
    this.newPost.patchValue({ postNumber: this.datacount + 1 });
  }

  // check if admin present
  checkUserPresent() {
    // this.checkUser = localStorage.getItem('credentials');
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
        this.currentBlogImgP = event.target.result;
      };
      const file = event.target.files[0];
      this.currentBlogImg = file;
    }
  }

  // submit post method
  submitAll() {
    let postBindedData = $('#dataBindings').val();

    this.newPost.patchValue({ post: postBindedData });

    this.SubmitPost(this.newPost.value);
    // this.channelPost(this.newPost.value);
  }

  // submit form method !!! MAIN !!!
  SubmitPost(data: Iblog) {
    if (!this.newPost.valid) {
      this.errResponse = 'Required fields cannot be empty*';
      let elemnt = document.getElementById('overlay');
      elemnt.style.zIndex = '3';
      return;
    }
    let d = document;
    d.getElementById('uploadSpinner2').style.display = 'inline-block';
    this.blogservice.publishBlog(data).subscribe(
      (item) => {
        this.logResponse = item.result;
        let elemnt = document.getElementById('overlay');
        elemnt.style.zIndex = '3';
      },
      (err) => {
        this.errResponse = err.error;
        let elemnt = document.getElementById('overlay');
        elemnt.style.zIndex = '3';
      }
    );
  }

  // remove notification overlay method
  off() {
    var elemnt = document.getElementById('overlay');

    elemnt.style.zIndex = '-10';
    location.reload();
  }

  // upload image method
  SubmitFile() {
    const formData = new FormData();
    let d = document;
    d.getElementById('uploadSpinner').style.display = 'inline-block';
    formData.append('postImage', this.currentBlogImg);
    this.blogservice.uploadImg(formData).subscribe((item) => {
      this.storeBlogImg = item;
      alert(this.storeBlogImg.message);
      d.getElementById('uploadSpinner').style.display = 'none';
      d.getElementById('uploadCheck').style.display = 'inline-block';
      this.newPost.patchValue({
        postImage: this.storeBlogImg.result['postImage'],
      });
    });
  }

  // post to telegram channel
  channelPost(data) {
    let title = data.postTitle;
    let post = data.post;
    this.blogservice.tgpost(title, post).subscribe((item) => {});
  }


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
  Search(data: IsearchResult) {
    if (data) {
      this.blogservice.searchBlog(data.post).subscribe((item) => {
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
    this.router.navigateByUrl('/About#developer');
  }

  // get blog post approx read time
  getreadTime(){
    this.readTimeCheck.length = 0
    this.totalWordsCheck.length = 0

    for(let d of this.data){
      let totalReadTime = readingTime(d.post)
      this.readTimeCheck.push(totalReadTime.text)
      this.totalWordsCheck.push(totalReadTime.words)
      
    }
  }
}
