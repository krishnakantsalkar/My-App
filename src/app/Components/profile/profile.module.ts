import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { RouterModule } from '@angular/router';
import { profileRoutes } from './profile-routes';

@NgModule({
  declarations: [ProfileComponent],
  imports: [CommonModule, RouterModule.forChild(profileRoutes)],
})
export class ProfileModule {}
