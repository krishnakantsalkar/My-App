import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CovidTrackerDistrictsComponent } from './covid-tracker-districts/covid-tracker-districts.component';
import { RouterModule } from '@angular/router';
import { covidDistrictsRoutes } from './covid-tracker-districts-routes';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [CovidTrackerDistrictsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(covidDistrictsRoutes),
    SharedModuleModule,
    DataTablesModule
  ]
})
export class CovidTrackerDistrictsModule { }
