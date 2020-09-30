import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './Components/main-page/main-page.component';
import { userloginservices } from './Shared/services/userloginservice';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { NgxCaptchaModule } from 'ngx-captcha';
import { Page404Component } from './Components/page404/page404.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { DISQUS_SHORTNAME } from 'ngx-disqus';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    Page404Component,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
  ],
  providers: [
    userloginservices,
    CookieService,
    // disqus comments
    { provide: DISQUS_SHORTNAME, useValue: 'prototype-8' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
