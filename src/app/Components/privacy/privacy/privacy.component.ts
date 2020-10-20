import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css'],
})
export class PrivacyComponent implements OnInit {
  public brightness;
  public pageTitle= 'Privacy Policy'
  constructor(private titleService: Title) {}

  ngOnInit(): void {
    this.mode();

    //set page title
this.titleService.setTitle(this.pageTitle)

    // disable brightness toggle
    $(document).ready(() => {
      $('.modeLD a').css('pointer-events', 'none');
      $('.modeLD a').css('opacity', 0.4);
    });
  }

  // dark/light mode method
  mode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }
}
