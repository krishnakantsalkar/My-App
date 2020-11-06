import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { RouterModule } from '@angular/router';
import { disclaimerRoutes } from './disclaimer-routes';
import { SharedModuleModule } from '../shared-module/shared-module.module';

@NgModule({
  declarations: [DisclaimerComponent],
  imports: [CommonModule, RouterModule.forChild(disclaimerRoutes),SharedModuleModule],
})
export class DisclaimerModule {}
