import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { covidNewsService } from 'src/app/Shared/services/covidNews';
import { ActivatedRoute, Router } from '@angular/router';
import { modeService } from '../../../Shared/services/light-dark-Modeservice';
import { DOCUMENT, Location } from '@angular/common';
import { TabView } from 'primeng/tabview';
import { Title } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { UiService } from 'src/app/Shared/services/ui.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-covid-news',
  templateUrl: './covid-news.component.html',
  styleUrls: ['./covid-news.component.css'],
  providers: [MessageService],
})
export class CovidNewsComponent implements OnInit {
  covidNews;
  healthNews;
  vaccineNews;
  covidIndiaStats;

  brightness: boolean;

  covidPageNo: number = 1;
  healthPageNo: number = 1;
  vaccinePageNo: number = 1;

  activeIndex;

  currentPgNo: number;

  title: string = 'Covid-19';

  todayDate: Date;

  @ViewChild(TabView) tabView: TabView;

  constructor(
    private covidStatService: covidNewsService,
    private AR: ActivatedRoute,
    private defaultModeService: modeService,
    private router: Router,
    private location: Location,
    private titleService: Title,
    private uiService: UiService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // brightness mode
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;
    });

    //title
    this.titleService.setTitle(this.title);

    // activated route
    this.AR.params.subscribe((item) => {
      let pg = item['page'];
      let section = item['section'];
      this.currentPgNo = parseInt(
        `${environment.baseUrl}${this.router.url}`.split('/')[5]
      );

      if (section == 'covid') {
        this.activeIndex = 0;
        this.covidPageNo = this.currentPgNo;
      } else if (section == 'health') {
        this.activeIndex = 1;
        this.healthPageNo = this.currentPgNo;
      } else if (section == 'vaccine') {
        this.activeIndex = 2;
        this.vaccinePageNo = this.currentPgNo;
      }

      // main api calls - credits to vaccovid.live
      this.getCovidNews(pg);
      this.getHealthNews(pg);
      this.getVaccineNews(pg);

      this.getIndiaStats();

      setInterval(() => {
        this.todayDate = new Date();
      }, 1000);
    });
  }

  // change tab and nav url
  navToTab(event) {
    this.activeIndex = event.index;
    if (event.index == 0) {
      this.location.replaceState(`/covid-news/covid/${this.covidPageNo}`);
      this.currentPgNo = parseInt(
        `${environment.baseUrl}${this.router.url}`.split('/')[5]
      );
    } else if (event.index == 1) {
      this.location.replaceState(`/covid-news/health/${this.healthPageNo}`);
      this.currentPgNo = parseInt(
        `${environment.baseUrl}${this.router.url}`.split('/')[5]
      );
    } else if (event.index == 2) {
      this.location.replaceState(`/covid-news/vaccine/${this.vaccinePageNo}`);
      this.currentPgNo = parseInt(
        `${environment.baseUrl}${this.router.url}`.split('/')[5]
      );
    }
  }

  // pagination logic

  pageNoChange(section, page) {
    if (section == 'covid') {
      if (page > 1) {
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      }

      this.getCovidNews(page);
      this.covidPageNo = page;
      this.location.replaceState(`/covid-news/covid/${page}`);
      this.currentPgNo = parseInt(
        `${environment.baseUrl}${this.router.url}`.split('/')[5]
      );
    } else if (section == 'health') {
      if (page > 1) {
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      }

      this.getHealthNews(page);
      this.healthPageNo = page;
      this.currentPgNo = parseInt(
        `${environment.baseUrl}${this.router.url}`.split('/')[5]
      );

      this.location.replaceState(`/covid-news/health/${page}`);
    } else if (section == 'vaccine') {
      if (page > 1) {
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      }

      this.getVaccineNews(page);
      this.vaccinePageNo = page;
      this.currentPgNo = parseInt(
        `${environment.baseUrl}${this.router.url}`.split('/')[5]
      );

      this.location.replaceState(`/covid-news/vaccine/${page}`);
    }
  }

  // get covid news
  getCovidNews(pg) {
    this.covidNews = undefined;
    this.covidStatService.getCovidNews(pg).subscribe((item) => {
      this.covidNews = item.news;
    });
  }

  // get vaccine news

  getVaccineNews(pg) {
    this.vaccineNews = undefined;
    this.covidStatService.getVaccineNews(pg).subscribe((item) => {
      this.vaccineNews = item.news;
    });
  }
  // get health news

  getHealthNews(pg) {
    this.healthNews = undefined;
    this.covidStatService.getHealthNews(pg).subscribe((item) => {
      this.healthNews = item.news;
    });
  }

  // get covid india stats

  getIndiaStats() {
    this.covidStatService.getCovidTotalStats().subscribe((item) => {
      this.covidIndiaStats = item[0];
    });
  }

  //copy link
  copyShareLink(link: string) {
    let val = link;
    const selBox = this.document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    this.document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    this.document.execCommand('copy');
    this.document.body.removeChild(selBox);

    this.uiService.showSnackbar('link copied to clipboard', null, 3500);
  }
}
