import { Route } from '@angular/router';
import { BlogpostsComponent } from './blogposts/blogposts.component';

export const blogpostsroute: Route[] = [
  {
    path: '',
    component: BlogpostsComponent,
  },
];
