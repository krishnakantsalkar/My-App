import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { modeService } from '../../../Shared/services/light-dark-Modeservice';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css'],
})
export class PrivacyComponent implements OnInit {
  public brightness;
  public pageTitle= 'Privacy Policy'
  constructor(private titleService: Title, private defaultModeService: modeService ) {}

  ngOnInit(): void {
    
    // brightness mode
    this.defaultModeService.modeSwitch.subscribe(item => {
      this.brightness = item
    })
    
    //set page title
    this.titleService.setTitle(this.pageTitle)

  }

}
