import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.css'],
})
export class DisclaimerComponent implements OnInit {
  public brightness: boolean;

  public pageTitle='Disclaimer'
  constructor( private titleService: Title) {}

  ngOnInit(): void {
    // method calls
    this.mode();

    //page title
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
