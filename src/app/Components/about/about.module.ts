import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { RouterModule } from '@angular/router';
import { aboutRoute } from './about-routes';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';

@NgModule({
  declarations: [AboutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(aboutRoute),
    SharedModuleModule,
    NgxUsefulSwiperModule,
  ],
})
export class AboutModule {}
