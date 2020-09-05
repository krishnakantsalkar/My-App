import { Component, OnInit } from '@angular/core';
import { MovieServices } from 'src/app/Shared/services/movieservice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css'],
})
export class MoviesComponent implements OnInit {
  public brightness: boolean; // light/dark mode
  public movieData;
  public pageNo;
  public currentList; // save current list in variable
  public currentListType;
  public searchResults;
  public searchErr;
  public mediaType;

  constructor(private movieService: MovieServices, private router: Router) {}

  ngOnInit(): void {
    // method calls
    this.mode();
    this.getTheLists(1, 'movie', 'now_playing');

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

  // dark/light mode method
  mode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }

  //scroll to top method
  topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // movie api usage

  getTheLists(pageNo, listType, listName) {
    this.currentList = listName;
    this.currentListType = listType;
    sessionStorage.setItem('listType', this.currentListType);

    this.movieService
      .getTheList(pageNo, listType, listName)
      .subscribe((item) => {
        this.movieData = item.results;
        this.router.navigateByUrl('/Movies&TV').then(() => {
          let elemnt = document.getElementById('movieList');
          if (elemnt) {
            elemnt.scrollIntoView({ behavior: 'smooth' });
          }
        });
        this.pageNo = pageNo;
        $('#MovieBox').prop('checked', true);
      });
  }

  // remove active button
  removeActiveBtn() {
    let activeBtn = document
      .getElementById('now_playing')
      .classList.remove('active');
  }

  //Search movie/tv API multi search

  SearchMedia() {
    let query = $('#movieTvSearch').val();
    this.movieService.searchByString(query).subscribe(
      (searchResult) => {
        this.searchResults = searchResult;
      },
      (err) => {
        this.searchErr = err.error;
      }
    );
  }

  // set listtype while navigating from search result!!
  setSearchListType(listType) {
    sessionStorage.setItem('listType', listType);
  }
}
