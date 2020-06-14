import { Component, OnInit } from '@angular/core';
import { blog } from '../../data/data';

@Component({
  selector: 'app-blogposts',
  templateUrl: './blogposts.component.html',
  styleUrls: ['./blogposts.component.css'],
})
export class BlogpostsComponent implements OnInit {
  public pageno: any;
  public brightness: boolean;
  public post;
  public posttitle;
  public postlink;
  constructor() {}

  ngOnInit(): void {
    this.postfunc();
  }

  postfunc() {
    let blogpostdata = new blog();
    let data = window.location.href.split('/');
    this.pageno = data[4];
    console.log(this.pageno);
    if (this.pageno == 1) {
      this.posttitle = blogpostdata.post1title;
      this.post = blogpostdata.post1;
      if (blogpostdata.postlink1) {
        this.postlink = blogpostdata.postlink1;
      }
    } else if (this.pageno == 2) {
      this.posttitle = blogpostdata.post2title;
      this.post = blogpostdata.post2;
      if (blogpostdata.postlink2) {
        this.postlink = blogpostdata.postlink2;
      }
    } else if (this.pageno == 3) {
      this.posttitle = blogpostdata.post3title;
      this.post = blogpostdata.post3;
      if (blogpostdata.postlink3) {
        this.postlink = blogpostdata.postlink3;
      }
    } else if (this.pageno == 4) {
      this.posttitle = blogpostdata.post4title;
      this.post = blogpostdata.post4;
      if (blogpostdata.postlink4) {
        this.postlink = blogpostdata.postlink4;
      }
    } else if (this.pageno == 5) {
      this.posttitle = blogpostdata.post5title;
      this.post = blogpostdata.post5;
      if (blogpostdata.postlink5) {
        this.postlink = blogpostdata.postlink5;
      }
    }
  }

  adjustHeight(el) {
    el.style.height =
      el.scrollHeight > el.clientHeight ? el.scrollHeight + 'px' : '60px';
  }

  mode() {
    this.brightness = !this.brightness;
  }
}
