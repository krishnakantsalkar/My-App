import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public title = 'TheArsonist';
  constructor(private titleService: Title) {
    this.titleService.setTitle(this.title);
  }

  // onActivate(event) {
  //   let scrollToTop = window.setInterval(() => {
  //     let pos = window.pageYOffset;
  //     if (pos > 0) {
  //       window.scrollTo(0, pos - 20); // how far to scroll on each step
  //     } else {
  //       window.clearInterval(scrollToTop);
  //     }
  //   }, 16);
  // }
  ngOnInit() {}
}
