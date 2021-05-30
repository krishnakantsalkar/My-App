import { Route } from '@angular/router';
import { CovidNewsComponent } from './covid-news/covid-news.component';

export const covidNewsRoutes: Route[] = [
  {
    path: '',
    component: CovidNewsComponent,
  },
];
