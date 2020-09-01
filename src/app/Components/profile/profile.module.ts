import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { RouterModule } from '@angular/router';
import { profileRoutes } from './profile-routes';
import { SharedModuleModule } from '../shared-module/shared-module.module';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(profileRoutes),
    SharedModuleModule,
  ],
})
export class ProfileModule {}
