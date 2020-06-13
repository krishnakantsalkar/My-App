import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './Components/main-page/main-page.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
  },
  {
    path: 'Home',
    component: MainPageComponent,
  },
  {
    path: 'About',
    loadChildren: () =>
      import('./Components/about/about.module').then((m) => m.AboutModule),
  },
  {
    path: 'Blog',
    loadChildren: () =>
      import('./Components/blog/blog.module').then((m) => m.BlogModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
