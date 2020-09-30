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
  public movieDetails; // main movie details
  public movieReviews; // movie reviews
  public movieSimilars; // similar movies
  public pageNo;
  public listType;
  public movieCredits; //list type
  public epSwitch: boolean;
  public tvSeasonsTotal;
  public eps;

  constructor(
    private movieService: MovieServices,
    private router: Router,
    private AR: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    // method calls
    this.mode();
    this.epMenu();

    // Activated routing
    this.AR.params.subscribe((item) => {
      let id = item['id'];

      let url = window.location.href.split('/');
      if (url[4] == 'Movie') {
        this.listType = 'movie';
      } else if (url[4] == 'TV') {
        this.listType = 'tv';
      }
      // get movie data by id
      this.movieService.getMoviesById(id, this.listType).subscribe((item) => {
        this.movieDetails = item;
        this.tvSeasonsTotal = this.movieDetails.number_of_seasons;
      });
      // get movie review by id
      this.movieService
        .movieReviewsById(id, this.listType)
        .subscribe((review) => {
          this.movieReviews = review;
        });
      // get movie similar to current by id
      this.movieService
        .getSimilarMoviesTV(id, this.listType)
        .subscribe((similar) => {
          this.movieSimilars = similar;
        });
      // get credits of current movie by id
      this.movieService
        .getMovieTvCredits(id, this.listType)
        .subscribe((credits) => {
          this.movieCredits = credits;
        });
    });

    // disable brightness toggle
    $(document).ready(() => {
      $('.modeLD a').css('pointer-events', 'none');
      $('.modeLD a').css('opacity', 0.4);
    });
  }

  // brightness mode
  mode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }

  // scroll to top
  topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // back to page
  backToPage() {
    this.location.back();
  }

  // epDropDown
  epMenu() {
    this.epSwitch = !this.epSwitch;
  }

  // movie season ep list service

  seasonsEpList(id: number, seasonsNo: number) {
    this.movieService.getTvSeasonDetails(id, seasonsNo).subscribe((item) => {
      this.eps = item;
    });
  }
}
