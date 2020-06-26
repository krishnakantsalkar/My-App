import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { blogpostservice } from 'src/app/Shared/services/blogservice';
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

  constructor(private blogservice: blogpostservice) {}

  ngOnInit(): void {
    this.mode();
    // this.datadisplay();
    this.blogs();
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
    });
  }
}
