import { Component, OnInit } from '@angular/core';
import { MovieServices } from '../../../Shared/services/movieservice';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css'],
})
export class MovieDetailsComponent implements OnInit {
  public brightness: boolean;
  public movieDetails;
  public movieReviews;
  public movieSimilars;
  public pageNo;
  public listType;

  constructor(
    private movieService: MovieServices,
    private router: Router,
    private AR: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    // method calls
    this.mode();

    // Activated routing
    this.AR.params.subscribe((item) => {
      let id = item['id'];
      // let listType = sessionStorage.getItem('listType');
      let url = window.location.href.split('/');
      if (url[4] == 'Movie') {
        this.listType = 'movie';
      } else if (url[4] == 'TV') {
        this.listType = 'tv';
      }
      this.movieService.getMoviesById(id, this.listType).subscribe((item) => {
        this.movieDetails = item;
      });
      this.movieService
        .movieReviewsById(id, this.listType)
        .subscribe((review) => {
          this.movieReviews = review;
        });
      this.movieService
        .getSimilarMoviesTV(id, this.listType)
        .subscribe((similar) => {
          this.movieSimilars = similar;
        });
    });

    //Get the button
    var mybutton = document.getElementById('myBtn');
    let mediaQ = window.matchMedia('(max-width: 600px)');

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function () {
      scrollFunction();
      scrollFunctionMedia(mediaQ);
    };

    function scrollFunction() {
      if (
        document.body.scrollTop > 50 ||
        document.documentElement.scrollTop > 50
      ) {
        mybutton.style.display = 'block';
        document.getElementById('top-panel').style.height = '60px';
        document.getElementById('top-panel').style.transitionDuration = '0.2s';
        document.getElementById('top-panel').style.transitionTimingFunction =
          'ease-in';
        document.getElementById('top-panel-nametag').style.paddingTop = '10px';
        document.getElementById('links').style.marginTop = '0px';
        document.getElementById('links').style.padding = ' 11px';
      } else {
        mybutton.style.display = 'none';
        document.getElementById('top-panel').style.height = '90px';
        document.getElementById('top-panel-nametag').style.paddingTop = '25px';
        document.getElementById('links').style.marginTop = '10px';
        document.getElementById('links').style.padding = ' 15px';
      }
    }

    function scrollFunctionMedia(mediaQuery) {
      if (
        (mediaQuery.matches && document.body.scrollTop > 50) ||
        (mediaQuery.matches && document.documentElement.scrollTop > 50)
      ) {
        document.getElementById('top-panel').style.height = '85px';
        document.getElementById('top-panel-nametag').style.paddingTop = '15px';
        document.getElementById('links').style.marginTop = '-15px';
      } else if (
        (mediaQuery.matches && document.body.scrollTop < 50) ||
        (mediaQuery.matches && document.documentElement.scrollTop < 50)
      ) {
        document.getElementById('top-panel').style.height = '110px';
        document.getElementById('top-panel-nametag').style.paddingTop = '25px';
        document.getElementById('links').style.marginTop = '-5px';
      }
    }
  }
  mode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }

  topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // back to page
  backToPage() {
    this.location.back();
  }
}
