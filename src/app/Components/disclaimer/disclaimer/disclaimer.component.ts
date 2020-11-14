import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { modeService } from '../../../Shared/services/light-dark-Modeservice';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.css'],
})
export class DisclaimerComponent implements OnInit {
  public brightness: boolean;

  public pageTitle='Disclaimer'
  constructor( private titleService: Title, private defaultModeService: modeService) {}

  ngOnInit(): void {
    // method calls

    // brightness mode
    this.defaultModeService.modeSwitch.subscribe(item => {  
    this.brightness = item
})
    //page title
    this.titleService.setTitle(this.pageTitle)

  }

}
