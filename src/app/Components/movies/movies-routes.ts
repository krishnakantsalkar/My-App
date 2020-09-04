import { Route } from '@angular/router';
import { MoviesComponent } from './movies/movies.component';

export const moviesroutes: Route[] = [
  {
    path: '',
    component: MoviesComponent,
  },
];
