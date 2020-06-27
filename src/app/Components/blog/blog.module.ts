import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogComponent } from './blog/blog.component';
import { RouterModule } from '@angular/router';
import { blogRoutes } from './blog-routes';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [BlogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(blogRoutes),
    ReactiveFormsModule,
  ],
})
export class BlogModule {}
