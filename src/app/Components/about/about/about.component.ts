import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  public email: string = 'Krishnakantsalkar@gmail.com';
  public phone: string = '+919619705613';
  public github: string = 'https://github.com/krishnakantsalkar';
  constructor() {}

  ngOnInit() {
    AOS.init({
      startEvent: 'scroll',
    });
  }
}