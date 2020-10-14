import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { RouterModule } from '@angular/router';
import { movieDetailsRoutes } from './movie-details-routes';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { SafePipe } from 'src/app/pipes/safe.pipe';

@NgModule({
  declarations: [MovieDetailsComponent, SafePipe],
  imports: [
    CommonModule,
    RouterModule.forChild(movieDetailsRoutes),
    SharedModuleModule,
  ],
})
export class MovieDetailsModule {}
