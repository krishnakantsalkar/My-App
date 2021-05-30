import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class covidNewsService {
  header: HttpHeaders;

  constructor(private http: HttpClient) {
    this.header = new HttpHeaders({
      'x-rapidapi-key': '', //removed for github
      'x-rapidapi-host': '', //removed for github
    });
  }

  getCovidNews(pgNo) {
    return this.http.get<any>(
      'https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/news/get-coronavirus-news/' +
        pgNo,
      {
        headers: this.header,
      }
    );
  }

  getHealthNews(pgNo) {
    return this.http.get<any>(
      'https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/news/get-health-news/' +
        pgNo,
      {
        headers: this.header,
      }
    );
  }

  getVaccineNews(pgNo) {
    return this.http.get<any>(
      'https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/news/get-vaccine-news/' +
        pgNo,
      {
        headers: this.header,
      }
    );
  }

  getCovidTotalStats() {
    return this.http.get<any>(
      'https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/npm-covid-data/world'
    );
  }
}
