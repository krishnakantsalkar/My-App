import { NgModule, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BlogpostsComponent,
  ConfirmDeleteDialogComponent,
} from './blogposts/blogposts.component';
import { RouterModule } from '@angular/router';
import { blogpostsroute } from './blogposts-routes';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { DisqusModule, DISQUS_SHORTNAME } from 'ngx-disqus';

@NgModule({
  declarations: [BlogpostsComponent, ConfirmDeleteDialogComponent],
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
          breaks: true,
          pedantic: false,
          smartLists: true,
          smartypants: true,
        },
      },
    }),
    DisqusModule,
  ],
  providers: [CookieService],
})
export class BlogpostsModule {}
