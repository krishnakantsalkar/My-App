import { Component, OnInit } from '@angular/core';
import { covidApiService } from '../../../Shared/services/covidTrackerApi';
import * as sort from 'sorttable'

@Component({
  selector: 'app-covid-tracker',
  templateUrl: './covid-tracker.component.html',
  styleUrls: ['./covid-tracker.component.css']
})
export class CovidTrackerComponent implements OnInit {
public brightness
public covidData
public updateTime
// columns list
public columns = 
    ["totalInfected",
      "newInfected",
      "recovered",
      "newRecovered",
      "deceased",
      "newDeceased"
    ]
// states
public states =
    ["States",
     "Total Infected",
     "New Infected",
      "Recovered",
      "New Recovered",
      "Deceased",
      "New Deceased"
    ]
  constructor(private covidApi: covidApiService) { }

  ngOnInit(): void {

    // method calls
    this.mode()
 
    // covid data api call
    this.covidApi.getcovidData().subscribe(item=>{

      this.covidData = item
      this.showUpdatedTime()
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

// transform ISO time to local time
showUpdatedTime(){
  let time = new Date( this.covidData.lastUpdatedAtApify)

  this.updateTime = time.toLocaleString()

}
 

}
