import { Route } from '@angular/router';
import { CovidTrackerComponent } from './covid-tracker/covid-tracker.component';


export const covidRoutes : Route[]= [

    {
        path:'',
        component:CovidTrackerComponent
    }
]