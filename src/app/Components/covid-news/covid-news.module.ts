import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CovidNewsComponent } from './covid-news/covid-news.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { RouterModule } from '@angular/router';
import { covidNewsRoutes } from './covid-news-routes';

@NgModule({
  declarations: [CovidNewsComponent],
  imports: [
    CommonModule,
    SharedModuleModule,
    RouterModule.forChild(covidNewsRoutes),
  ],
})
export class CovidNewsModule {}
