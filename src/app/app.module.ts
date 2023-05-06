import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  BottomSheetOverviewExampleSheet,
  MainPageComponent,
} from './Components/main-page/main-page.component';
import { userloginservices } from './Shared/services/userloginservice';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { NgxCaptchaModule } from 'ngx-captcha';
import { Page404Component } from './Components/page404/page404.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { DISQUS_SHORTNAME } from 'ngx-disqus';
// import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { SharedModuleModule } from './Components/shared-module/shared-module.module';
import { QuillModule } from 'ngx-quill';
import { SkeletonModule } from 'primeng/skeleton';
import { FooterComponent } from './Components/footer/footer.component';
import { TokenInterceptorInterceptor } from './Shared/services/token-interceptor.interceptor';
import { GeneralUpdatesLauncherComponent } from './Components/general-updates-launcher/general-updates-launcher.component';
import {
  NgxUiLoaderRouterModule,
  NgxUiLoaderConfig,
  NgxUiLoaderModule,
} from 'ngx-ui-loader';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: 'blue',
  bgsOpacity: 0.5,
  bgsPosition: 'bottom-right',
  bgsSize: 60,
  bgsType: 'ball-spin-clockwise',
  blur: 0,
  delay: 0,
  fastFadeOut: true,
  fgsColor: 'blue',
  fgsPosition: 'bottom-right',
  fgsSize: 20,
  fgsType: 'three-strings',
  gap: 24,
  logoPosition: 'center-center',
  logoSize: 80,
  logoUrl: '',
  masterLoaderId: 'master',
  overlayBorderRadius: '0',
  overlayColor: 'rgba(40,40,40,0.17)',
  pbColor: 'blue',
  pbDirection: 'ltr',
  pbThickness: 3,
  hasProgressBar: true,
  text: '',
  textColor: '#FFFFFF',
  textPosition: 'center-center',
  maxTime: -1,
  minTime: 300,
};

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    Page404Component,
    NavbarComponent,
    FooterComponent,
    BottomSheetOverviewExampleSheet,
    GeneralUpdatesLauncherComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    // SnotifyModule,
    SkeletonModule,
    SharedModuleModule,
    QuillModule.forRoot(),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
  ],
  providers: [
    userloginservices,
    CookieService,
    // disqus comments
    { provide: DISQUS_SHORTNAME, useValue: 'prototype-8' },
    // { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
    // SnotifyService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
