import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BdayComponent } from './bday/bday.component';
import { RouterModule } from '@angular/router';
import { bdayroutes } from './bday-routes';

@NgModule({
  declarations: [BdayComponent],
  imports: [CommonModule, RouterModule.forChild(bdayroutes)],
})
export class BdayModule {}
