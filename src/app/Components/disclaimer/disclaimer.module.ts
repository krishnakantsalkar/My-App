import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { RouterModule } from '@angular/router';
import { disclaimerRoutes } from './disclaimer-routes';

@NgModule({
  declarations: [DisclaimerComponent],
  imports: [CommonModule, RouterModule.forChild(disclaimerRoutes)],
})
export class DisclaimerModule {}
