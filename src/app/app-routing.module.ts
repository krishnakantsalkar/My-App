import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { MainPageComponent } from './Components/main-page/main-page.component';
import { authGuard } from './Shared/services/authguard';
import { Page404Component } from './Components/page404/page404.component';
import { LoginPageGuardGuard } from './Shared/services/login-page-guard.guard';

export const routes: Routes = [
  // default route
  {
    path: '',
    component: MainPageComponent,
  },
  {
    path: 'home',
    component: MainPageComponent,
  },
  // about page
  {
    path: 'about',
    loadChildren: () =>
      import('./Components/about/about.module').then((m) => m.AboutModule),
  },
  // blog page
  {
    path: 'blog/:page',
    loadChildren: () =>
      import('./Components/blog/blog.module').then((m) => m.BlogModule),
  },
  // blogpost page
  {
    path: 'blog/:postNumber/:id',
    loadChildren: () =>
      import('./Components/blogposts/blogposts.module').then(
        (m) => m.BlogpostsModule
      ),
  },
  // blogpost by id
  {
    path: 'blog/:postNumber/:postTitle/:id',
    loadChildren: () =>
      import('./Components/blogposts/blogposts.module').then(
        (m) => m.BlogpostsModule
      ),
    pathMatch: 'full',
  },
  // login page
  {
    path: 'login',
    loadChildren: () =>
      import('./Components/login/login.module').then((m) => m.LoginModule),
    canActivate: [LoginPageGuardGuard],
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
    path: 'movies&tv',
    loadChildren: () =>
      import('./Components/movies/movies.module').then((m) => m.MoviesModule),
  },
  // Activated routing for movie/tv
  {
    path: 'movies&tv/Movie/:name/:id',
    loadChildren: () =>
      import('./Components/movie-details/movie-details.module').then(
        (m) => m.MovieDetailsModule
      ),
    pathMatch: 'full',
  },
  {
    path: 'movies&tv/TV/:name/:id',
    loadChildren: () =>
      import('./Components/movie-details/movie-details.module').then(
        (m) => m.MovieDetailsModule
      ),
    pathMatch: 'full',
  },

  // privacy page route
  {
    path: 'privacy',
    loadChildren: () =>
      import('./Components/privacy/privacy.module').then(
        (m) => m.PrivacyModule
      ),
  },

  // disclaimer page route
  {
    path: 'disclaimer',
    loadChildren: () =>
      import('./Components/disclaimer/disclaimer.module').then(
        (m) => m.DisclaimerModule
      ),
  },

  //notes route
  {
    path: 'notes',
    loadChildren: () =>
      import('./Components/notes/notes.module').then((m) => m.NotesModule),
    canActivate: [authGuard],
  },

  // covid news route
  {
    path: 'covid-news/:section/:page',
    loadChildren: () =>
      import('./Components/covid-news/covid-news.module').then(
        (m) => m.CovidNewsModule
      ),
    pathMatch: 'full',
  },
  // poll generator route
  {
    path: 'polls',
    loadChildren: () =>
      import('./Components/poll-creator/poll-creator.module').then(
        (m) => m.PollCreatorModule
      ),
  },

  //  search by tag
  {
    path: 'searchTag',
    loadChildren: () =>
      import('./Components/search-by-tag/search-by-tag.module').then(
        (m) => m.SearchByTagModule
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
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
