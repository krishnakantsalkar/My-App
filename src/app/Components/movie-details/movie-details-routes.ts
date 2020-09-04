import { Route } from '@angular/router';
import { MovieDetailsComponent } from './movie-details/movie-details.component';

export const movieDetailsRoutes: Route[] = [
  {
    path: '',
    component: MovieDetailsComponent,
  },
];
