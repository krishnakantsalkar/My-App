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

public pageUrl
  constructor(private covidApi: covidApiService, private titleService:Title) { }

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
      this.totalCovidData= item
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
    
    // add icons to data
    this.checkRedFn()
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

// add icons to new data
checkRedFn(){

  setTimeout(()=> {
     
    
  let checkRed = $('.covidDataLoop').hasClass('red')
  let checkYellow = $('.covidDataLoop').hasClass('yellow')
  let checkGreen= $('.covidDataLoop').hasClass('green')
  let checkViolet= $('.covidDataLoop').hasClass('violet')
  let checkOrange= $('.covidDataLoop').hasClass('orange')

  if (checkRed === true){
  $('.red').append(`<i class="fas fa-arrow-up" style="color:red"></i>`)
  
  }
  if (checkYellow === true){
    $('.yellow').append(`<i class="fas fa-skull" style="color:red"></i>`)
    
  }
  if (checkGreen === true){
    $('.green').append(`<i class="fas fa-check-circle" style="color:green"></i>`)
    
  }
  if (checkViolet === true){
    $('.violet').append(`<i class="fas fa-arrow-down" style="color:violet"></i>`)
    
  }
  if (checkOrange === true){
    $('.orange').append(`<i class="fas fa-arrow-up" style="color:red"></i>`)
    
  }
 },2000)

 }
}
