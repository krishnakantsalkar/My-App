import { Component, OnInit, ViewChild } from '@angular/core';
import { modeService } from '../../Shared/services/light-dark-Modeservice';
import { CookieService } from 'ngx-cookie-service';
import { userloginservices } from '../../Shared/services/userloginservice';
import { GeneralUpdatesService } from '../../Shared/services/general-updates.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-general-updates-launcher',
  templateUrl: './general-updates-launcher.component.html',
  styleUrls: ['./general-updates-launcher.component.css'],
})
export class GeneralUpdatesLauncherComponent implements OnInit {
  side: boolean = false;
  brightness: boolean;
  window = window;
  checkUser: any;
  currentPage: number = 1;
  sortBy = 'desc';
  dateStart = new Date();

  updates = [];

  updateLinksArr = [];

  @ViewChild('newUpdate')
  newUpdate;

  constructor(
    private defaultModeService: modeService,
    private cookies: CookieService,
    private logonServices: userloginservices,
    private updateService: GeneralUpdatesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // brightness mode
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;
    });

    this.logonServices.currentUsers.subscribe((data) => {
      this.checkUser = data;
    });
  }

  open() {
    this.side = !this.side;

    if (this.side) {
      this.getUpdates();
    }
  }

  getUpdates() {
    this.updateService
      .getUpdates(this.currentPage, this.sortBy, this.dateStart)
      .subscribe((item: any) => {
        this.updates = item.dataSize;
        console.log(item);
      });
  }

  newUpdateDialog() {
    let diag = this.dialog.open(this.newUpdate, {
      minWidth: '30vw',
    });
  }
}
