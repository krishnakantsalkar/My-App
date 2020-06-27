import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { blogpostservice } from 'src/app/Shared/services/blogservice';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-blogposts',
  templateUrl: './blogposts.component.html',
  styleUrls: ['./blogposts.component.css'],
})
export class BlogpostsComponent implements OnInit {
  public brightness: boolean;
  public data;
  public url;
  constructor(
    private blogservice: blogpostservice,
    private AR: ActivatedRoute,
    private sanitizer: DomSanitizer // to sanitize urls , method below
  ) {}

  ngOnInit(): void {
    this.mode(); // dark-light mode toggle

    AOS.init({
      startEvent: 'DOMContentLoaded',
    });
    this.AR.params.subscribe((item) => {
      let id = item['id'];
      this.blogservice.getBlogsbyId(id).subscribe((items) => {
        this.data = items;
        if (this.data.postLink.length > 3) {
          this.url = this.data.postLink;
        }
      });
    });
  }

  getLink(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.url);
  }

  mode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }
}
