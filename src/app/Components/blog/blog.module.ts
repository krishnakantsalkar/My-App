import { NgModule, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogComponent } from './blog/blog.component';
import { RouterModule } from '@angular/router';
import { blogRoutes } from './blog-routes';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { MarkdownModule, MARKED_OPTIONS } from 'ngx-markdown';

@NgModule({
  declarations: [BlogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(blogRoutes),
    ReactiveFormsModule,
    SharedModuleModule,
    FormsModule,
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE,
      markedOptions: {
        provide: MARKED_OPTIONS,
        useValue: {
          gfm: true,
          breaks: true,
          pedantic: false,
          smartLists: true,
          smartypants: true,
        },
      },
    }),
  ],
  providers: [CookieService],
})
export class BlogModule {}
