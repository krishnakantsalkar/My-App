import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { blogpostservice } from 'src/app/Shared/services/blogservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Iblog } from 'src/app/Shared/model/blogmodel';

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
  constructor(private blogservice: blogpostservice, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.mode();
    this.blogs();
    this.checkUserPresent();
    AOS.init({
      startEvent: 'DOMContentLoaded',
    });

    this.newPost = this.fb.group({
      postNumber: ['', [Validators.required]],
      postTitle: ['', Validators.required],
      post: ['', Validators.required],
      postLink: [''],
    });
  }

  mode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }

  blogs() {
    this.blogservice.getBlogs().subscribe((item) => {
      this.data = item;
    });
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

  SubmitPost(data: Iblog) {
    if (!this.newPost.valid) {
      return;
    }
    // console.log(data);
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
  channelPost(data) {
    let title = data.postTitle;
    let post = data.post;
    this.blogservice.tgpost(title, post).subscribe((item) => {
      console.log(item);
      location.reload();
    });
  }
}
