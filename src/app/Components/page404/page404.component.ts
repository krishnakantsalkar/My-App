import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.css'],
})
export class Page404Component implements OnInit {
  public brightness;
  public pageTitle='404'
  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // call functions
    this.mode();

    //set page title
    this.titleService.setTitle(this.pageTitle)

    // disable brightness toggle
    $(document).ready(() => {
      $('.modeLD a').css('pointer-events', 'none');
      $('.modeLD a').css('opacity', 0.4);
    });
  }

  // dark/light mode
  mode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }
}
