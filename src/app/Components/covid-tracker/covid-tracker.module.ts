import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CovidTrackerComponent } from './covid-tracker/covid-tracker.component';
import { RouterModule } from '@angular/router';
import { covidRoutes } from './covid-routes';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [CovidTrackerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(covidRoutes),
    SharedModuleModule,
    DataTablesModule
  ]
})
export class CovidTrackerModule { }
