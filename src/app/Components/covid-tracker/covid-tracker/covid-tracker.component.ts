import { Component, OnInit } from '@angular/core';
import { covidApiService } from '../../../Shared/services/covidTrackerApi';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import { modeService } from '../../../Shared/services/light-dark-Modeservice';
import { userloginservices } from '../../../Shared/services/userloginservice';
import { clientIpService } from '../../../Shared/services/clientip-service';
import { userIp } from '../../../Shared/model/userViewModel';

@Component({
  selector: 'app-covid-tracker',
  templateUrl: './covid-tracker.component.html',
  styleUrls: ['./covid-tracker.component.css'],
})
export class CovidTrackerComponent implements OnInit {
  public brightness;
  public covidData;
  public updateTime;
  public totalCovidData;

  public pageTitle = 'Covid-19 Tracker';

  public pageUrl;

  public dtOptions: DataTables.Settings = {};

  public adminCheck;

  public today;
  public yesterday;
  public dayBefore;
  public month;
  public monthNames: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  public totalViews;

  constructor(
    private covidApi: covidApiService,
    private titleService: Title,
    private defaultModeService: modeService,
    private loginService: userloginservices,
    private clientservice: clientIpService
  ) {}

  ngOnInit(): void {
    // method calls

    // track userviews
    this.clientservice.getClientIp().subscribe((item: userIp) => {
      let data = { views: item.ip };

      this.covidApi.trackViews(data).subscribe((item2) => {
        this.totalViews = item2.result;
      });
    });

    // brightness mode
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;
    });

    // aos animations
    AOS.init({
      startEvent: 'DomContentLoaded',
    });

    //set page title
    this.titleService.setTitle(this.pageTitle);

    //  load today's covid data
    this.getTodayCovidData();

    //  covid total stats
    this.covidApi.getCovidDataTotal().subscribe((item) => {
      this.totalCovidData = item;
      // console.log(this.totalCovidData)
    });

    // check admin presence
    this.loginService.currentUsers.subscribe((item) => {
      this.adminCheck = item;
    });

    //get page url
    this.pageUrl = window.location.href;

    //current time
    this.currentTime();

    // options for dataTables
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 19,
      ordering: true,
      order: [1, 'desc'],
      searching: true,
      search: {
        caseInsensitive: true,
      },
      responsive: true,
      stateSave: true,
    };

    // initialize dates
    this.today = new Date().getDate();
    this.yesterday = this.today - 1;
    this.dayBefore = this.today - 2;
    // initialize month
    let currentDate = new Date();
    this.month = this.monthNames[currentDate.getMonth()];

    // show/hide history options
    $(document).ready(() => {
      $('.historyOptions').hide();
    });
    $('.showHistory').on('click', () => {
      $('.historyOptions').show(300);
    });

    $('.hideHistory').on('click', () => {
      $('.historyOptions').hide(300);
    });
  }

  // current time
  currentTime() {
    let checkUpdatedTime = sessionStorage.getItem('covidData');
    if (!checkUpdatedTime) {
      let d = new Date();
      this.updateTime = d.toLocaleString();
      sessionStorage.setItem('covidData', this.updateTime);
    } else {
      this.updateTime = sessionStorage.getItem('covidData');
    }
  }

  // get latest covid Data
  getTodayCovidData() {
    this.covidApi.getCovidData2().subscribe((item) => {
      this.covidData = null;
      this.covidData = item;
      // console.log(this.covidData)
    });
  }

  // store data to db
  sendData() {
    if (confirm('Send data to database?')) {
      this.covidApi.storeCovidData(this.covidData).subscribe(
        (item) => {
          console.log(item);
          alert('Data stored to DB');
        },
        (err) => {
          alert('Something went wrong! check console');
        }
      );
    } else {
      return;
    }
  }

  // get data by date
  getData(date) {
    this.covidApi.getStoredCovidData(date).subscribe((item) => {
      this.covidData = null;
      this.covidData = item[0].data;
    });
  }
}
