import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogpostsComponent } from './blogposts/blogposts.component';
import { RouterModule } from '@angular/router';
import { blogpostsroute } from './blogposts-routes';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { SharedModuleModule } from '../shared-module/shared-module.module';

@NgModule({
  declarations: [BlogpostsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(blogpostsroute),
    ReactiveFormsModule,
    SharedModuleModule,
  ],
  providers: [CookieService],
})
export class BlogpostsModule {}
