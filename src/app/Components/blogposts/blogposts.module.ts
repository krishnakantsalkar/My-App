import { NgModule, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogpostsComponent } from './blogposts/blogposts.component';
import { RouterModule } from '@angular/router';
import { blogpostsroute } from './blogposts-routes';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

@NgModule({
  declarations: [BlogpostsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(blogpostsroute),
    ReactiveFormsModule,
    SharedModuleModule,
    FormsModule,
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE,
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          gfm: true,
          breaks: false,
          pedantic: false,
          smartLists: true,
          smartypants: true,
        },
      },
    }),
  ],
  providers: [CookieService],
})
export class BlogpostsModule {}
