import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogpostsComponent } from './blogposts/blogposts.component';
import { RouterModule } from '@angular/router';
import { blogpostsroute } from './blogposts-routes';

@NgModule({
  declarations: [BlogpostsComponent],
  imports: [CommonModule, RouterModule.forChild(blogpostsroute)],
})
export class BlogpostsModule {}
