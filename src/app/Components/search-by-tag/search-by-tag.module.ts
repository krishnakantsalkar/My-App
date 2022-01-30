import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchByTagComponent } from './search-by-tag/search-by-tag.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { RouterModule } from '@angular/router';
import { searchByTagRoutes } from './searchByTag.routes';

@NgModule({
  declarations: [SearchByTagComponent],
  imports: [
    CommonModule,
    SharedModuleModule,
    RouterModule.forChild(searchByTagRoutes),
  ],
})
export class SearchByTagModule {}
