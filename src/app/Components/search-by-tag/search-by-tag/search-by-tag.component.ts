import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { modeService } from 'src/app/Shared/services/light-dark-Modeservice';
import { UiService } from 'src/app/Shared/services/ui.service';
import { blogpostservice } from '../../../Shared/services/blogservice';

@Component({
  selector: 'app-search-by-tag',
  templateUrl: './search-by-tag.component.html',
  styleUrls: ['./search-by-tag.component.css'],
})
export class SearchByTagComponent implements OnInit {
  brightness: boolean;
  searchKeyword: string;
  blogposts: any[] = [];
  isLoaded: boolean = false;
  constructor(
    private defaultModeService: modeService,
    private AR: ActivatedRoute,
    private router: Router,
    private blogService: blogpostservice,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;
    });

    this.AR.queryParams.subscribe((params) => {
      if (!params.search) {
        this.router.navigateByUrl('/blog/1');
      }

      this.searchByTag(params.search);
    });
  }

  searchByTag(tagName) {
    this.blogService.searchByTag(tagName).subscribe(
      (item) => {
        this.blogposts = item.result;

        this.isLoaded = true;
      },
      (err) => {
        this.uiService.showSnackbar('Something went wrong', null, 3000);
      }
    );
  }
}
