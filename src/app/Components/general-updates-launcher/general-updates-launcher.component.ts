import { Component, OnInit, ViewChild } from '@angular/core';
import { modeService } from '../../Shared/services/light-dark-Modeservice';
import { CookieService } from 'ngx-cookie-service';
import { userloginservices } from '../../Shared/services/userloginservice';
import { GeneralUpdatesService } from '../../Shared/services/general-updates.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { UiService } from '../../Shared/services/ui.service';

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

  _imgUrlModel;
  _contentModel;
  _linkModel;
  badgeHidden: boolean = false;
  @ViewChild('newUpdate')
  newUpdate;
  updDialog: any;
  dataCount: number;
  pageSize: number;
  isEditUpdate: boolean;
  updateId: any;
  badgeCount: any;
  badgeCountSaved: number;

  constructor(
    private defaultModeService: modeService,
    private cookies: CookieService,
    private logonServices: userloginservices,
    private updateService: GeneralUpdatesService,
    private dialog: MatDialog,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    // brightness mode
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;
    });

    this.logonServices.currentUsers.subscribe((data) => {
      this.checkUser = data;
    });

    this.uiService.domClick$.subscribe((item) => {
      if (item.clientX <= window.innerWidth - window.innerWidth * 0.25) {
        this.side = false;
      }
    });

    this.getUpdates();
  }

  open() {
    this.side = !this.side;

    if (this.side) {
      this.getUpdates();
    }

    this.badgeHidden = true;
  }

  getUpdates() {
    this.updateService
      .getUpdates(this.currentPage, this.sortBy, this.dateStart)
      .subscribe((item: any) => {
        this.updates = item.dataSize;
        this.dataCount = item.dataCount;
        this.pageSize = item.pageSize;

        //calc updates

        if (localStorage.getItem('badgeCount')) {
          this.badgeCountSaved = JSON.parse(localStorage.getItem('badgeCount'));
        } else {
          this.badgeCount = this.updates.length;
          this.badgeCountSaved = this.updates.length;
          localStorage.setItem('badgeCount', JSON.stringify(this.badgeCount));

          return;
        }

        if (this.badgeCountSaved < this.updates.length) {
          this.badgeHidden = false;

          this.badgeCount = this.updates.length - this.badgeCountSaved;
          this.badgeCountSaved = this.updates.length;
          localStorage.setItem(
            'badgeCount',
            JSON.stringify(this.badgeCountSaved)
          );
        } else if (this.badgeCountSaved > this.updates.length) {
          this.badgeHidden = true;

          this.badgeCount = this.updates.length;
          localStorage.setItem('badgeCount', JSON.stringify(this.badgeCount));
        } else {
          this.badgeHidden = true;
        }
      });
  }

  addLink() {
    this.updateLinksArr.push(this._linkModel);
    this._linkModel = null;
  }

  removeLink(i) {
    this.updateLinksArr.splice(i, 1);
  }

  cancelUpdate() {
    this.updDialog.close();
  }

  newUpdateDialog() {
    this.isEditUpdate = false;
    this._contentModel = '';
    this._imgUrlModel = '';
    this._linkModel = '';
    this.updateLinksArr = [];
    this.updDialog = this.dialog.open(this.newUpdate, {
      minWidth: '30vw',
      backdropClass: 'bgBlur',
    });
  }

  editUpdateDialog(i) {
    this.isEditUpdate = true;
    this._linkModel = '';

    this._contentModel = this.updates[i].updateText;
    this._imgUrlModel = this.updates[i].updateImgUrl;
    this.updateLinksArr = this.updates[i].updateLinks;
    this.updateId = this.updates[i].updateId;
    this.updDialog = this.dialog.open(this.newUpdate, {
      minWidth: '30vw',
      backdropClass: 'bgBlur',
    });
  }

  saveUpdate() {
    this.updDialog.close();
    let obj = {
      updateImgUrl: this._imgUrlModel,
      updateText: this._contentModel,
      updateLinks: this.updateLinksArr,
    };

    this.updateService.postUpdate(obj).subscribe(
      (item: any) => {
        this.uiService.showSnackbar(item.message, null, 3000);
        this.getUpdates();
      },
      (err) => {
        this.uiService.showSnackbar(err.error.message, null, 3000);
      }
    );
  }

  editUpdate() {
    this.updDialog.close();
    this.isEditUpdate = false;
    let obj = {
      updateImgUrl: this._imgUrlModel,
      updateText: this._contentModel,
      updateLinks: this.updateLinksArr,
    };

    this.updateService.editUpdate(obj, this.updateId).subscribe(
      (item: any) => {
        this.uiService.showSnackbar(item.message, null, 3000);
        this.getUpdates();
      },
      (err) => {
        this.uiService.showSnackbar(err.error.message, null, 3000);
      }
    );
  }
  deleteUpdate(id) {
    this.updateService.deleteUpdate(id).subscribe((item) => {
      this.uiService.showSnackbar('Update deleted!', null, 3000);
      this.getUpdates();
    });
  }

  loadMore() {
    if (this.currentPage == this.pageSize) {
      return;
    }

    this.currentPage += 1;
    this.updateService
      .getUpdates(this.currentPage, this.sortBy, this.dateStart)
      .subscribe((item: any) => {
        this.updates.push(...item.dataSize);
        this.dataCount = item.dataCount;
        this.pageSize = item.pageSize;
      });
  }
}
