import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { RouterModule } from '@angular/router';
import { aboutRoute } from './about-routes';
import { SharedModuleModule } from '../shared-module/shared-module.module';

@NgModule({
  declarations: [AboutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(aboutRoute),
    SharedModuleModule,
  ],
})
export class AboutModule {}
