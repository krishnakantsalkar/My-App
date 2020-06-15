import { Component, OnInit } from '@angular/core';
import { blog } from 'src/app/Shared/data';
import * as AOS from 'aos';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  public brightness: boolean;
  public date = new Date();
  public data1;
  public data2;
  public data3;
  public data4;

  public title1;
  public title2;
  public title3;
  public title4;

  constructor() {}

  ngOnInit(): void {
    this.mode();
    this.datadisplay();
    AOS.init({
      startEvent: 'scroll',
    });
  }

  mode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }

  datadisplay() {
    let blogdata = new blog();
    this.data1 = blogdata.post1.substring(1, 90) + '....';
    this.data2 = blogdata.post2.substring(1, 90) + '....';
    this.data3 = blogdata.post3.substring(1, 90) + '....';
    this.data4 = blogdata.post4.substring(1, 90) + '....';

    this.title1 = blogdata.post1title;
    this.title2 = blogdata.post2title;
    this.title3 = blogdata.post3title;
    this.title4 = blogdata.post4title;
  }
}
