import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './Components/main-page/main-page.component';
import { authGuard } from './Shared/services/authguard';
import { Page404Component } from './Components/page404/page404.component';

const routes: Routes = [
  // default route
  {
    path: '',
    component: MainPageComponent,
  },
  {
    path: 'Home',
    component: MainPageComponent,
  },
  // about page
  {
    path: 'About',
    loadChildren: () =>
      import('./Components/about/about.module').then((m) => m.AboutModule),
  },
  // blog page
  {
    path: 'Blog/page/:page',
    loadChildren: () =>
      import('./Components/blog/blog.module').then((m) => m.BlogModule),
  },
  // blogpost page
  {
    path: 'Blogposts',
    loadChildren: () =>
      import('./Components/blogposts/blogposts.module').then(
        (m) => m.BlogpostsModule
      ),
  },
  // blogpost by id
  {
    path: 'Blog/:postNumber/:postTitle/:id',
    loadChildren: () =>
      import('./Components/blogposts/blogposts.module').then(
        (m) => m.BlogpostsModule
      ),
    pathMatch: 'full',
  },
  // login page
  {
    path: 'Login',
    loadChildren: () =>
      import('./Components/login/login.module').then((m) => m.LoginModule),
  },
  // bday page
  {
    path: 'Bday',
    loadChildren: () =>
      import('./Components/bday/bday.module').then((m) => m.BdayModule),
    canActivate: [authGuard],
  },
  // profile page
  {
    path: 'Profile/:id',
    loadChildren: () =>
      import('./Components/profile/profile.module').then(
        (m) => m.ProfileModule
      ),
    canActivate: [authGuard],
  },
  // reset password page
  {
    path: 'ResetPassword/:id',
    loadChildren: () =>
      import('./Components/resetpassword/resetpassword.module').then(
        (m) => m.ResetpasswordModule
      ),
  },

  // movie component route

  {
    path: 'Movies&TV',
    loadChildren: () =>
      import('./Components/movies/movies.module').then((m) => m.MoviesModule),
  },
  // Activated routing for movie/tv
  {
    path: 'Movies&TV/Movie/:name/:id',
    loadChildren: () =>
      import('./Components/movie-details/movie-details.module').then(
        (m) => m.MovieDetailsModule
      ),
    pathMatch: 'full',
  },
  {
    path: 'Movies&TV/TV/:name/:id',
    loadChildren: () =>
      import('./Components/movie-details/movie-details.module').then(
        (m) => m.MovieDetailsModule
      ),
    pathMatch: 'full',
  },
  {
    path: 'Privacy',
    loadChildren: () =>
      import('./Components/privacy/privacy.module').then(
        (m) => m.PrivacyModule
      ),
  },

  //wildcard route
  {
    path: '**',
    component: Page404Component,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
