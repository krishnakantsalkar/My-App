import { Route } from '@angular/router';
import { PollCreatorComponent } from './poll-creator/poll-creator.component';
import { PollViewComponent } from './poll-view/poll-view.component';

export const pollRoutes: Route[] = [
  {
    path: '',
    component: PollCreatorComponent,
  },
  { path: 'view/:id', component: PollViewComponent },
];
