import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class covidApiService {
  public header: HttpHeaders;
  public covidApiState: string =
    'https://api.covidindiatracker.com/state_data.json';
  public covidApiTotal: string = 'https://api.covidindiatracker.com/total.json';

  // stored covid data
  public covidDataStore: string =
    'https://mybackend-1911.herokuapp.com/api/covid/storeCovidData/';
  public getCovidDataStore: string =
    'https://mybackend-1911.herokuapp.com/api/covid/getOldCovidData/';

  public covidViewStore: string =
    'https://mybackend-1911.herokuapp.com/api/covid/covidDataView';

  constructor(private http: HttpClient) {
    this.header = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth-token': JSON.parse(localStorage.getItem('userToken')),
    });
  }

  // district wise data
  getCovidData2() {
    return this.http.get(this.covidApiState);
  }

  // total data
  getCovidDataTotal() {
    return this.http.get(this.covidApiTotal);
  }

  // stored covid data methods
  storeCovidData(data) {
    return this.http.post(this.covidDataStore, data, { headers: this.header });
  }

  getStoredCovidData(date) {
    return this.http.get<any>(this.getCovidDataStore + date);
  }

  trackViews(data) {
    return this.http.put<any>(this.covidViewStore, data);
  }
}
