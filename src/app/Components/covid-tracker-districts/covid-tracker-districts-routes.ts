import { Route } from '@angular/router';
import { CovidTrackerDistrictsComponent } from './covid-tracker-districts/covid-tracker-districts.component';


export const covidDistrictsRoutes : Route[]= [

    {
        path:'',
        component: CovidTrackerDistrictsComponent
    }
]