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

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  public brightness: boolean;
  public date = new Date();

  public data;

  public checkUser;

  public createPost: boolean;

  public newPost: FormGroup;
  public newSearch: FormGroup;
  public currentBlogImgP;
  public currentBlogImg;
  public storeBlogImg;
  public pageNo;
  public datacount;
  public searchResult;
  public logResponse;
  public errResponse;
  constructor(
    private blogservice: blogpostservice,
    private fb: FormBuilder,
    private router: Router,
    private cookies: CookieService
  ) {}

  ngOnInit(): void {
    this.mode();
    this.blogsP(1);
    this.checkUserPresent();
    AOS.init({
      startEvent: 'DOMContentLoaded',
    });

    this.newPost = this.fb.group({
      postImage: [''],
      postNumber: ['', [Validators.required]],
      postTitle: ['', Validators.required],
      post: ['', Validators.required],
      postLink: [''],
    });

    this.newSearch = this.fb.group({
      post: [''],
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
        document.getElementById('links').style.padding = ' 11px';
      } else {
        mybutton.style.display = 'none';
        document.getElementById('top-panel').style.height = '90px';
        document.getElementById('top-panel-nametag').style.paddingTop = '25px';
        document.getElementById('links').style.marginTop = '10px';
        document.getElementById('links').style.padding = ' 15px';
      }
    }

    function scrollFunctionMedia(mediaQuery) {
      if (
        (mediaQuery.matches && document.body.scrollTop > 50) ||
        (mediaQuery.matches && document.documentElement.scrollTop > 50)
      ) {
        document.getElementById('top-panel').style.height = '85px';
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
  }

  mode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }

  // blogs() {
  //   this.blogservice.getBlogs().subscribe((item) => {
  //     this.data = item.dataSize;
  //   });
  // }

  blogsP(pg) {
    this.blogservice.getBlogsP(pg).subscribe((item) => {
      this.data = item.dataSize;
      this.datacount = item.dataCount;
      this.router.navigateByUrl(`/Blog/page/${pg}`).then(() => {
        var elmnt = document.getElementById('scrolldata');
        if (elmnt) {
          elmnt.scrollIntoView();
        }
      });
    });
    this.pageNo = pg;
  }

  checkUserPresent() {
    // this.checkUser = localStorage.getItem('credentials');
    this.checkUser = this.cookies.get('credentials');
    if (!this.checkUser) {
    }
  }

  createPostmethod() {
    this.createPost = !this.createPost;
  }

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

  SubmitPost(data: Iblog) {
    if (!this.newPost.valid) {
      this.errResponse = 'Required fields cannot be empty*';
      let elemnt = document.getElementById('overlay');
      elemnt.style.zIndex = '3';
      return;
    }
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

  off() {
    var elemnt = document.getElementById('overlay');

    elemnt.style.zIndex = '-10';
    location.reload();
  }

  SubmitFile() {
    const formData = new FormData();
    formData.append('postImage', this.currentBlogImg);
    this.blogservice.uploadImg(formData).subscribe((item) => {
      this.storeBlogImg = item;
      alert(this.storeBlogImg.message);
      this.newPost.patchValue({
        postImage: this.storeBlogImg.result['postImage'],
      });
    });
  }

  channelPost(data) {
    let title = data.postTitle;
    let post = data.post;
    this.blogservice.tgpost(title, post).subscribe((item) => {});
  }
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  showsearch() {
    if (document.getElementById('searchbar')) {
      var element = document.getElementById('searchbar');
      var elementico = document.getElementById('searchicon');
      var elementcancl = document.getElementById('searchcancel');
      var elementsubmt = document.getElementById('searchsubmit');
      element.style.zIndex = '0';
      element.style.width = '100%';
      element.style.marginTop = '0px';

      elementico.style.zIndex = '0';
      elementico.style.marginTop = '0px';

      elementcancl.style.zIndex = '0';
      elementcancl.style.marginTop = '0px';
      elementcancl.style.background = 'red';

      elementsubmt.style.zIndex = '0';
      elementsubmt.style.marginTop = '0px';
      elementsubmt.style.background = 'green';
    }
  }

  hidesearch() {
    if (document.getElementById('searchbar')) {
      var element = document.getElementById('searchbar');
      var elementico = document.getElementById('searchicon');
      var elementcancl = document.getElementById('searchcancel');
      var elementsubmt = document.getElementById('searchsubmit');
      element.style.zIndex = '-1';
      element.style.width = '10%';
      element.style.marginTop = '-200px';

      elementico.style.zIndex = '-1';
      elementico.style.marginTop = '-200px';

      elementcancl.style.zIndex = '-1';
      elementcancl.style.marginTop = '-200px';
      elementcancl.style.background = 'red';

      elementsubmt.style.zIndex = '-1';
      elementsubmt.style.marginTop = '-200px';
      elementsubmt.style.background = 'red';
      this.searchResult = null;
      location.reload();
    }
  }

  Search(data: IsearchResult) {
    if (data) {
      this.blogservice.searchBlog(data.post).subscribe((item) => {
        this.searchResult = item.data;
      });
    }
  }
  cancel() {
    this.searchResult = null;
  }
}
