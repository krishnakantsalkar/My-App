import { Component, OnInit } from '@angular/core';
import { modeService } from 'src/app/Shared/services/light-dark-Modeservice';

@Component({
  selector: 'app-general-updates',
  templateUrl: './general-updates.component.html',
  styleUrls: ['./general-updates.component.css'],
})
export class GeneralUpdatesComponent implements OnInit {
  brightness: boolean;

  constructor(private defaultModeService: modeService) {}

  ngOnInit(): void {
    // brightness mode
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;
    });
  }
}
