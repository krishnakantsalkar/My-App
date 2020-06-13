import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogComponent } from './blog/blog.component';
import { RouterModule } from '@angular/router';
import { blogRoutes } from './blog-routes';

@NgModule({
  declarations: [BlogComponent],
  imports: [CommonModule, RouterModule.forChild(blogRoutes)],
})
export class BlogModule {}
