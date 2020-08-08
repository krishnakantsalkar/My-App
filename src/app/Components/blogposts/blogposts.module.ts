import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogpostsComponent } from './blogposts/blogposts.component';
import { RouterModule } from '@angular/router';
import { blogpostsroute } from './blogposts-routes';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [BlogpostsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(blogpostsroute),
    ReactiveFormsModule,
  ],
  providers: [CookieService],
})
export class BlogpostsModule {}
