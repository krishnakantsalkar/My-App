import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { blogpostservice } from 'src/app/Shared/services/blogservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Iblog } from 'src/app/Shared/model/blogmodel';
import { Router } from '@angular/router';

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
  public currentBlogImgP;
  public currentBlogImg;
  public storeBlogImg;
  public pageNo;
  public datacount;
  constructor(
    private blogservice: blogpostservice,
    private fb: FormBuilder,
    private router: Router
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
    this.checkUser = localStorage.getItem('credentials');
    if (!this.checkUser) {
      console.log('user not logged in');
    }
  }

  createPostmethod() {
    this.createPost = !this.createPost;
    // console.log(this.createPost);
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
      return;
    }
    this.blogservice.publishBlog(data).subscribe(
      (item) => {
        let title = item.result.postTitle;
        alert(`Post added successfully! \n New post: ${title}`);
      },
      (err) => {
        alert(err.error);
      }
    );
  }

  SubmitFile() {
    const formData = new FormData();
    formData.append('postImage', this.currentBlogImg);
    this.blogservice.uploadImg(formData).subscribe((item) => {
      this.storeBlogImg = item;
      // console.log(this.storeBlogImg);
      alert(this.storeBlogImg.message);
      this.newPost.patchValue({
        postImage: this.storeBlogImg.result['postImage'],
      });
    });
  }

  channelPost(data) {
    let title = data.postTitle;
    let post = data.post;
    this.blogservice.tgpost(title, post).subscribe((item) => {
      // console.log(item);
      location.reload();
    });
  }
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}
