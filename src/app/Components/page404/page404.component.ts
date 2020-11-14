import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { modeService } from '../../Shared/services/light-dark-Modeservice';

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.css'],
})
export class Page404Component implements OnInit {
  public brightness;
  public pageTitle='404'
  constructor(private titleService: Title, private defaultModeService: modeService) {}

  ngOnInit(): void {
    // call functions

    // brightness mode
    this.defaultModeService.modeSwitch.subscribe(item => {
      this.brightness = item
    })
    //set page title
    this.titleService.setTitle(this.pageTitle)

  }
}
