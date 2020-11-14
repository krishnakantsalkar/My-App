import { Component, OnInit } from '@angular/core';
import { covidApiService } from '../../../Shared/services/covidTrackerApi';
import { Title } from '@angular/platform-browser';
import { modeService } from '../../../Shared/services/light-dark-Modeservice';

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

  public districtHeader = [
    "name",
    "confirmed",
    "recovered",
    "deaths",
    "oldConfirmed", 
    "oldRecovered",
    "oldDeaths",
    "zone" 
  ]

  public pageTitle= 'Covid-19 Tracker'

  public dtOptions: DataTables.Settings = {}

  constructor(private covidApi:covidApiService, private titleService:Title, private defaultModeService: modeService) { }

  ngOnInit(): void {

    // brightness mode
    this.defaultModeService.modeSwitch.subscribe(item => {
      this.brightness = item
    })

     //set page title
     this.titleService.setTitle(this.pageTitle)

    this.covidApi.getCovidData2().subscribe(item=>{
      this.covidData = item
      let temp = window.location.href.split('/')
      let route = temp[5].replace(/%20/g, " ")
      this.covidDistrict = route
      this.getdistrictData()


    
    })

    // options for angular datatables
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 15,
      ordering: true,
      order: [1,'desc'],
      searching: true,
      search: {
        caseInsensitive: true
      },
      responsive: true,
      stateSave:true
    };
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
