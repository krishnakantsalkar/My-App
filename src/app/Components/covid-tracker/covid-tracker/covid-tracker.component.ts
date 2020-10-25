import { Component, OnInit } from '@angular/core';
import { covidApiService } from '../../../Shared/services/covidTrackerApi';
import * as sort from 'sorttable'
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-covid-tracker',
  templateUrl: './covid-tracker.component.html',
  styleUrls: ['./covid-tracker.component.css']
})
export class CovidTrackerComponent implements OnInit {
public brightness
public covidData
public updateTime
public totalCovidData
public states =[
    "States",
    "Active",
    "Confirmed",
    "Recovered",
    "Deaths",
    "New Active",
    "New Confirmed",
    "New Recovered",
    "New Deaths",   
  ]

public stateData = [ 
  "state",
      "active",
      "confirmed",
      "recovered",
      "deaths",
      "aChanges",
      "cChanges",
      "rChanges",
      "dChanges",
]

public districtHeader= [
     "name",
     "confirmed",
     "recovered",
     "deaths",
     "oldConfirmed",
     "oldRecovered",
     "oldDeaths",
     "zone"
]

public pageTitle = 'Covid-19 Tracker'

  constructor(private covidApi: covidApiService, private titleService:Title) { }

  ngOnInit(): void {

    // method calls
    this.mode()

     //set page title  
     this.titleService.setTitle(this.pageTitle)
    
    this.covidApi.getCovidData2().subscribe(item=>{
      this.covidData = item
      // console.log(this.covidData)
    })
    this.covidApi.getCovidDataTotal().subscribe(item=>{
      this.totalCovidData= item
    })

     // disable brightness toggle
     $(document).ready(() => {
      $('.modeLD a').css('pointer-events', 'none');
      $('.modeLD a').css('opacity', 0.4);
    });
  }

 //dark-light mode
 mode() {
  this.brightness = JSON.parse(localStorage.getItem('mode'));
}
}
