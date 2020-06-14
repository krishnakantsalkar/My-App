import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  public brightness: boolean;
  public date = new Date();
  constructor() {}

  ngOnInit(): void {}

  mode() {
    this.brightness = !this.brightness;
  }
}
