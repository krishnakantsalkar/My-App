import { Component, OnInit } from '@angular/core';
import { covidApiService } from '../../../Shared/services/covidTrackerApi';

@Component({
  selector: 'app-covid-tracker-districts',
  templateUrl: './covid-tracker-districts.component.html',
  styleUrls: ['./covid-tracker-districts.component.css']
})
export class CovidTrackerDistrictsComponent implements OnInit {

  public brightness:boolean
  public covidData
  public covidDistrict
  public covidDistrictData

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
  constructor(private covidApi:covidApiService) { }

  ngOnInit(): void {

    this.mode()

    this.covidApi.getCovidData2().subscribe(item=>{
      this.covidData = item
      let temp = window.location.href.split('/')
      let route = temp[5].replace(/%20/g, " ")
      this.covidDistrict = route
      this.getdistrictData()


    
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

// get district data
  getdistrictData(){
  for(let d of this.covidData){
    if (d.state == this.covidDistrict){
      this.covidDistrictData = d.districtData
    }
  }
}
}
