import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './Components/main-page/main-page.component';
import { userloginservices } from './Shared/services/userloginservice';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, MainPageComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [userloginservices],
  bootstrap: [AppComponent],
})
export class AppModule {}
