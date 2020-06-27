import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { blogpostservice } from 'src/app/Shared/services/blogservice';

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
  constructor(private blogservice: blogpostservice) {}

  ngOnInit(): void {
    this.mode();
    this.blogs();
    this.checkUserPresent();
    AOS.init({
      startEvent: 'scroll',
    });
  }

  mode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }

  blogs() {
    this.blogservice.getBlogs().subscribe((item) => {
      this.data = item;
      console.log(this.data);
    });
  }

  checkUserPresent() {
    this.checkUser = localStorage.getItem('credentials');
    if (!this.checkUser) {
      console.log('user not logged in');
    }
  }
}
