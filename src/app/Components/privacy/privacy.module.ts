import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyComponent } from './privacy/privacy.component';
import { RouterModule } from '@angular/router';
import { privacyRoutes } from './privacy-routes';

@NgModule({
  declarations: [PrivacyComponent],
  imports: [CommonModule, RouterModule.forChild(privacyRoutes)],
})
export class PrivacyModule {}
