import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralUpdatesComponent } from './general-updates/general-updates.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { RouterModule } from '@angular/router';
import { genUpdateRoute } from './general-updates.routes';

@NgModule({
  declarations: [GeneralUpdatesComponent],
  imports: [
    CommonModule,
    SharedModuleModule,
    RouterModule.forChild(genUpdateRoute),
  ],
})
export class GeneralUpdatesModule {}
