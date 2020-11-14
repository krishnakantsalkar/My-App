import { Component, OnInit } from '@angular/core';
import { covidApiService } from '../../../Shared/services/covidTrackerApi';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import { modeService } from '../../../Shared/services/light-dark-Modeservice';

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

public pageTitle = 'Covid-19 Tracker'

public pageUrl
 
public dtOptions: DataTables.Settings = {}

  constructor(private covidApi: covidApiService, private titleService:Title, private defaultModeService: modeService) {}

  ngOnInit(): void {

    // method calls

    // brightness mode
    this.defaultModeService.modeSwitch.subscribe(item=>{
      this.brightness = item
    })

   // aos animations
   AOS.init({
    startEvent: 'DomContentLoaded',
  });

     //set page title  
     this.titleService.setTitle(this.pageTitle)
    
    this.covidApi.getCovidData2().subscribe(item=>{
      this.covidData = item
      // console.log(this.covidData)
    })

    this.covidApi.getCovidDataTotal().subscribe(item=>{ 
      this.totalCovidData = item
          // console.log(this.totalCovidData)    
    }) 

    //get page url
    this.pageUrl = window.location.href
   

    //current time 
    this.currentTime()
    
    // options for dataTables
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 19,
      ordering: true,
      order: [1,'desc'],
      searching: true,
      search: {
        caseInsensitive: true
      },
      responsive: true,
      stateSave: true
    };
  }

// current time
 currentTime(){

  let checkUpdatedTime = sessionStorage.getItem('covidData')
  if(!checkUpdatedTime){

  let d = new Date()
  this.updateTime = d.toLocaleString()
  sessionStorage.setItem('covidData', this.updateTime)

 }else {
  this.updateTime = sessionStorage.getItem('covidData')
 }

}

}
