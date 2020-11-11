import { Component, OnInit } from '@angular/core';
import { covidApiService } from '../../../Shared/services/covidTrackerApi';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';

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

  constructor(private covidApi: covidApiService, private titleService:Title) {}

  ngOnInit(): void {

    // method calls
    this.mode()

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



     // disable brightness toggle
     $(document).ready(() => {
      $('.modeLD a').css('pointer-events', 'none');
      $('.modeLD a').css('opacity', 0.4);
    });

    //get page url
    this.pageUrl = window.location.href
   

    //current time 
    this.currentTime()
    
    // delay to icons
    this.delayIconsSpan()

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
      responsive: true
    };
  }

 //dark-light mode 
 mode() {
  this.brightness = JSON.parse(localStorage.getItem('mode'));
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

// show icons after 1s delay

delayIconsSpan(){

  setTimeout(()=>{

    $('.tableBody span').css({visibility: 'visible'})
 
  },1200)
 }
}
