import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { modeService } from '../../../Shared/services/light-dark-Modeservice';

@Component({
  selector: 'app-bottom-share-sheet',
  templateUrl: './bottom-share-sheet.component.html',
  styleUrls: ['./bottom-share-sheet.component.css'],
})
export class BottomShareSheetComponent implements OnInit {
  public blogURL: string;
  brightness: boolean;
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data,
    private defaultModeService: modeService
  ) {}

  ngOnInit(): void {
    // brightness mode
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;
    });
    console.log(this.data);

    this.blogURL = this.data.blogURL;
  }
}
