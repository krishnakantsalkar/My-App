import { Component, OnInit } from '@angular/core';
import { MovieServices } from 'src/app/Shared/services/movieservice';
import { Router } from '@angular/router';
import * as superplaceholder from 'superplaceholder';
import * as AOS from 'aos';
import { Title } from '@angular/platform-browser';
import { modeService } from '../../../Shared/services/light-dark-Modeservice';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css'],
})
export class MoviesComponent implements OnInit {
  public brightness: boolean; // light/dark mode
  public movieData;
  public pageNo: number = 1;
  public currentList; // save current list in variable
  public currentListType;
  public searchResults;
  public searchErr;
  public mediaType;

  public genreData;
  public genreSwitch: boolean;

  public pageTitle = 'Movies&Tv';

  // movie genre collection
  public movieGenreCollection = {
    action: 28,
    adventure: 12,
    animation: 16,
    comedy: 35,
    family: 10751,
    fantasy: 14,
    horror: 27,
    romance: 10749,
    scifi: 878,
  };
  private movieGenreCollectString = {
    28: 'action',
    12: 'adventure',
    16: 'animation',
    35: 'comedy',
    10751: 'family',
    14: 'fantasy',
    27: 'horror',
    10749: 'romance',
    878: 'sci-fi',
  };

  // tv genre collection
  public tvGenreCollection = {
    action: 10759,
    animation: 16,
    comedy: 35,
    crime: 80,
    drama: 18,
    family: 10751,
    mystery: 9648,
    reality: 10764,
    scifi: 10765,
  };
  private tvGenreCollectString = {
    10759: 'action',
    16: 'animation',
    35: 'comedy',
    80: 'crime',
    18: 'drama',
    10751: 'family',
    9648: 'mystery',
    10764: 'reality',
    10765: 'sci-fi',
  };

  public currentGenre;
  public currentGenreId;

  // trending movies/tv
  public trendingMovies;
  public trendingTv;
  pageSize: number;
  genrePageSize: number;

  constructor(
    private movieService: MovieServices,
    private router: Router,
    private titleService: Title,
    private defaultModeService: modeService
  ) {}

  ngOnInit(): void {
    // method calls

    // brightness mode
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;
    });
    this.getTheLists(1, 'movie', 'now_playing');

    // set page title
    this.titleService.setTitle(this.pageTitle);

    // aos animations
    AOS.init({
      startEvent: 'DOMContentLoaded',
    });

    // animated placeholder
    superplaceholder({
      el: document.getElementById('movieTvSearch'),
      sentences: [
        'Breaking Bad',
        'F.R.I.E.N.D.S',
        'Rick and Morty',
        'Lucifer',
        'Stranger Things',
        'The Boys',
        'Avatar',
        'Avengers: Infinity war',
        'The Godfather',
        'Pulp Fiction',
      ],
      options: {
        shuffle: true,
        autoStart: true,
        letterDelay: 300,
      },
    });

    // remove active state from default button
    $(() => {
      $('#genreButtons').hide();

      // hide trending content on page load
      $('#TmoviesData').hide();
      $('#TseriesData').hide();
      $('#TcloseBtn').hide();
    });

    // show/hide Trending movies/tv
    $('#Tmovies').on('click', () => {});

    $('#TcloseBtn').on('click', () => {});
  }

  // movie api usage

  openTrendingMovies() {
    // get trending movies and tv series
    this.movieService.getTrendingMedia('movie').subscribe((item) => {
      this.trendingMovies = item;
      $('#TmoviesData').show(300);
      $('#TseriesData').hide();
      $('#TcloseBtn').show(300);
      $('#TcloseBtn').animate({ rotate: 180, transition: '1s ease' });
    });
  }

  openTrendingSeries() {
    this.movieService.getTrendingMedia('tv').subscribe((item) => {
      this.trendingTv = item;

      $('#Tseries').on('click', () => {
        $('#TseriesData').show(300);
        $('#TmoviesData').hide();
        $('#TcloseBtn').show(300);
      });
    });
  }

  closeTrending() {
    this.trendingMovies = undefined;
    this.trendingTv = undefined;
    $('#TseriesData').hide(300);
    $('#TmoviesData').hide(300);
    $('#TcloseBtn').hide(300);
  }
  getTheLists(pageNo, listType, listName) {
    this.currentList = listName;
    this.currentListType = listType;
    sessionStorage.setItem('listType', this.currentListType);

    this.movieService
      .getTheList(pageNo, listType, listName)
      .subscribe((item) => {
        this.movieData = item.results;

        console.log(item.results);
        this.router.navigateByUrl('/movies&tv').then(() => {
          let elemnt = document.getElementById('movieList');
          if (elemnt) {
            elemnt.scrollIntoView({ behavior: 'smooth' });
          }
        });
        this.pageNo = pageNo;
        $('#MovieBox').prop('checked', true);
      });

    this.movieService
      .getTheListAll(pageNo, listType, listName)
      .subscribe((item1) => {
        this.pageSize = item1.total_pages;
      });
  }

  // remove active button
  removeActiveBtn() {
    let activeBtn = document
      .getElementById('now_playing')
      .classList.remove('active');
  }

  //Search movie/tv API multi search

  SearchMedia(event) {
    event.preventDefault();
    let query = $('#movieTvSearch').val();
    if (!query) {
      return (this.searchErr = "Can't send empty query mate... :/");
    }
    this.movieService.searchByString(query).subscribe(
      (searchResult) => {
        this.searchResults = searchResult;
      },
      (err) => {
        this.searchErr = err;
      }
    );
  }

  // set listtype while navigating from search result!!
  setSearchListType(listType) {
    sessionStorage.setItem('listType', listType);
  }

  // genre switch

  genreMenu() {
    this.genreSwitch = !this.genreSwitch;
    if (this.genreSwitch) {
      $('#genreButtons').show(300);
    }
    if (!this.genreSwitch) {
      $('#genreButtons').hide(300);
      this.currentGenre = undefined;
      this.genreData = undefined;
    }
    $('#TmoviesData').hide();
    $('#TseriesData').hide();
    $('#TcloseBtn').hide();
  }

  // discover by genre API method

  discoverByGenre(pageNo, listType, genreId) {
    this.currentGenreId = genreId;
    this.currentListType = listType;
    sessionStorage.setItem('listType', listType);

    if (listType == 'movie') {
      this.currentGenre =
        this.movieGenreCollectString[`${this.currentGenreId}`];
    } else if (listType == 'tv') {
      this.currentGenre = this.tvGenreCollectString[`${this.currentGenreId}`];
    }

    this.movieService
      .discoverByListId(pageNo, listType, genreId)
      .subscribe((item) => {
        this.genreData = item.results;
        this.router.navigateByUrl('/movies&tv').then(() => {
          let elemnt = document.getElementById('genreList');
          if (elemnt) {
            elemnt.scrollIntoView({ behavior: 'smooth' });
          }
        });
        this.pageNo = pageNo;
      });

    this.movieService
      .discoverByListIdAll(pageNo, listType, genreId)
      .subscribe((item) => {
        this.genrePageSize = item.total_pages;
      });
  }
}
