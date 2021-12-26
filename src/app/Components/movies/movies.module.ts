import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesComponent } from './movies/movies.component';
import { RouterModule } from '@angular/router';
import { moviesroutes } from './movies-routes';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [MoviesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(moviesroutes),
    FormsModule,
    SharedModuleModule,
  ],
})
export class MoviesModule {}
