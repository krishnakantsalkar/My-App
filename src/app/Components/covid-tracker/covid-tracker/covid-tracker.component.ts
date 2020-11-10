import { Component, OnInit } from '@angular/core';
import { covidApiService } from '../../../Shared/services/covidTrackerApi';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import { OrderPipe } from 'ngx-order-pipe';

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
 
// ngx-order-pipe custom properties
public order: string = 'active'
public reverse: boolean = false;

public sortedCollection: any[] =[]

  constructor(private covidApi: covidApiService, private titleService:Title, private orderPipe: OrderPipe) { 
    // ngx-order-pipe custom method
    this.sortedCollection = this.orderPipe.transform(this.covidData, this.order); 
  }

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


// ngx-order-pipe custom method
 setOrder(value: string) {
  if (this.order === value) {
    this.reverse = !this.reverse;
  }
  this.order = value;
}

// show icons after 1s delay

delayIconsSpan(){

  setTimeout(()=>{

    $('.tableBody span').css({visibility: 'visible'})
 
  },1200)
 }
}
