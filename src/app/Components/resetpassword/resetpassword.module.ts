import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { RouterModule } from '@angular/router';
import { resetPassRoutes } from './resetpassword-routes';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ResetpasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(resetPassRoutes),
    ReactiveFormsModule,
  ],
})
export class ResetpasswordModule {}
