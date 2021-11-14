import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PollCreatorComponent } from './poll-creator/poll-creator.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { RouterModule } from '@angular/router';
import { pollRoutes } from './poll-routes';
import { FormsModule } from '@angular/forms';
import { PollViewComponent } from './poll-view/poll-view.component';

@NgModule({
  declarations: [PollCreatorComponent, PollViewComponent],
  imports: [
    CommonModule,
    SharedModuleModule,
    FormsModule,
    RouterModule.forChild(pollRoutes),
  ],
})
export class PollCreatorModule {}
