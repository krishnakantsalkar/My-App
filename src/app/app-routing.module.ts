import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './Components/main-page/main-page.component';
import { authGuard } from './Shared/services/authguard';

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
  {
    path: 'Blogposts',
    loadChildren: () =>
      import('./Components/blogposts/blogposts.module').then(
        (m) => m.BlogpostsModule
      ),
  },

  {
    path: 'Blog/:id',
    loadChildren: () =>
      import('./Components/blogposts/blogposts.module').then(
        (m) => m.BlogpostsModule
      ),
  },
  {
    path: 'Login',
    loadChildren: () =>
      import('./Components/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'Bday',
    loadChildren: () =>
      import('./Components/bday/bday.module').then((m) => m.BdayModule),
    canActivate: [authGuard],
  },
  {
    path: 'Profile/:id',
    loadChildren: () =>
      import('./Components/profile/profile.module').then(
        (m) => m.ProfileModule
      ),
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
