import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
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
