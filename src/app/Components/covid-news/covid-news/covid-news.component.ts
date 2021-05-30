import { Component, OnInit } from '@angular/core';
import { covidNewsService } from 'src/app/Shared/services/covidNews';
import { ActivatedRoute, Router } from '@angular/router';
import { modeService } from '../../../Shared/services/light-dark-Modeservice';
import { Location } from '@angular/common';

@Component({
  selector: 'app-covid-news',
  templateUrl: './covid-news.component.html',
  styleUrls: ['./covid-news.component.css'],
})
export class CovidNewsComponent implements OnInit {
  covidNews;
  healthNews;
  vaccineNews;
  worldStats;

  brightness: boolean;

  covidPageNo: number = 0;
  healthPageNo: number = 0;
  vaccinePageNo: number = 0;

  activeIndex: number;

  currentPgNo: string;

  constructor(
    private covidStatService: covidNewsService,
    private AR: ActivatedRoute,
    private defaultModeService: modeService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    // brightness mode
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;
    });

    // activated route
    this.AR.params.subscribe((item) => {
      let pg = item['page'];
      let section = item['section'];
      this.currentPgNo = window.location.href.split('/')[5];

      if (section == 'covid') {
        this.activeIndex = 0;
        this.covidPageNo = parseInt(this.currentPgNo);
      } else if (section == 'health') {
        this.activeIndex = 1;
        this.healthPageNo = parseInt(this.currentPgNo);
      } else if (section == 'vaccine') {
        this.activeIndex = 2;
        this.vaccinePageNo = parseInt(this.currentPgNo);
      }

      // main api calls - credits to vaccovid.live
      this.getCovidNews(pg);
      this.getHealthNews(pg);
      this.getVaccineNews(pg);
    });
  }

  // change tab and nav url
  navToTab(event) {
    if (event.index == 0) {
      this.location.replaceState(`/covid-news/covid/${this.covidPageNo}`);
      this.currentPgNo = window.location.href.split('/')[5];
    } else if (event.index == 1) {
      this.location.replaceState(`/covid-news/health/${this.healthPageNo}`);
      this.currentPgNo = window.location.href.split('/')[5];
    } else if (event.index == 2) {
      this.location.replaceState(`/covid-news/vaccine/${this.vaccinePageNo}`);
      this.currentPgNo = window.location.href.split('/')[5];
    }
  }

  // pagination logic

  pageNoChange(section, page) {
    if (section == 'covid') {
      this.getCovidNews(page);
      this.covidPageNo = page;
      this.location.replaceState(`/covid-news/covid/${page}`);
      this.currentPgNo = window.location.href.split('/')[5];

      if (page > 1) {
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      }
    } else if (section == 'health') {
      this.getHealthNews(page);
      this.healthPageNo = page;
      this.currentPgNo = window.location.href.split('/')[5];

      this.location.replaceState(`/covid-news/health/${page}`);
      if (page > 1) {
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      }
    } else if (section == 'vaccine') {
      this.getVaccineNews(page);
      this.vaccinePageNo = page;
      this.currentPgNo = window.location.href.split('/')[5];

      this.location.replaceState(`/covid-news/vaccine/${page}`);
      if (page > 1) {
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      }
    }
  }

  // get covid news
  getCovidNews(pg) {
    this.covidNews = undefined;
    this.covidStatService.getCovidNews(pg).subscribe((item) => {
      this.covidNews = item.news;

      console.log(this.covidNews);
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

  // to do later
  getWorldStats() {
    this.covidStatService.getCovidTotalStats().subscribe((item) => {
      this.worldStats = item;
    });
  }
}
