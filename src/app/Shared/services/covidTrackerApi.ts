import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class covidApiService {
  public header: HttpHeaders;
  public covidApiState: string = 'https://api.covidindiatracker.com/state_data.json'
  public covidApiTotal:string = 'https://api.covidindiatracker.com/total.json'
  constructor(private http: HttpClient) {
    this.header = new HttpHeaders({ 'Content-Type': 'application/json' });
  }

// district wise data
getCovidData2(){
  return this.http.get(this.covidApiState)
}

// total data
getCovidDataTotal(){
  return this.http.get(this.covidApiTotal)
}
}
