import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { PrimeNGConfig } from 'primeng/api';
import { fromEvent } from 'rxjs';
import { UiService } from './Shared/services/ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public checkSession: boolean;
  constructor(
    private titleService: Title,
    private primengConfig: PrimeNGConfig,
    private meta: Meta,
    private uiService: UiService
  ) {}

  // onActivate(event) {
  //   let scrollToTop = window.setInterval(() => {
  //     let pos = window.pageYOffset;
  //     if (pos > 0) {
  //       window.scrollTo(0, pos - 20); // how far to scroll on each step
  //     } else {
  //       window.clearInterval(scrollToTop);
  //     }
  //   }, 16);
  // }
  ngOnInit() {
    this.primengConfig.ripple = true;

    this.meta.addTags([
      { property: 'og:locale', content: 'en_US' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'Blog' },
      { property: 'og:url', content: 'https://krishnakantsalkar.in/home' },
      { property: 'og:site_name', content: 'https://krishnakantsalkar.in' },
      {
        property: 'og:image',
        content:
          'https://user-images.githubusercontent.com/53054807/117562032-7f882800-b0b9-11eb-8917-3cb1fb970148.jpg',
      },
      { property: 'og:width', content: '1200' },
      { property: 'og:height', content: '630' },
    ]);

    this.uiService.checkSession$.subscribe((item) => {
      this.checkSession = item;
    });

    let source = fromEvent(document, 'click');
    source.subscribe((item) => {
      this.uiService.domClick$.next(item);
    });
  }
}
