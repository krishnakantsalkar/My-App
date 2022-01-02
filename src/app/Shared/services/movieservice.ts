import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Imovies, ImovieDetails } from '../model/movieModel';

@Injectable({ providedIn: 'root' })
export class MovieServices {
  private movieDbAPI: string = 'https://api.themoviedb.org/3/movie/'; //popular movies base API
  private movieDbAPIKey: string = ''; //api id removed for public upload

  private movieLang: string = 'en-US'; // data language
  private moviePage: number = 1; // data page no.

  //listType = movie or tv //
  //listName= popular, top_rated etc//

  public header: HttpHeaders;
  constructor(private http: HttpClient, private router: Router) {
    this.header = new HttpHeaders({
      'Content-Type': 'application/json',
      skip: 'true',
    });
  }

  // get all data from API
  public getTheList(pageNo, listType, listName): Observable<Imovies> {
    return this.http.get<Imovies>(
      `${this.movieDbAPI}${listType}/${listName}?api_key=${this.movieDbAPIKey}&language=${this.movieLang}&page=${pageNo}`,
      { headers: this.header }
    );
  }

  // non paginated - get all data from API
  public getTheListAll(pageNo, listType, listName): Observable<Imovies> {
    return this.http.get<Imovies>(
      `${this.movieDbAPI}${listType}/${listName}?api_key=${this.movieDbAPIKey}&language=${this.movieLang}`,
      { headers: this.header }
    );
  }

  // get single data by id
  public getMoviesById(id, listType): Observable<ImovieDetails> {
    return this.http.get<ImovieDetails>(
      `${this.movieDbAPI}${listType}/${id}?api_key=${this.movieDbAPIKey}&language=${this.movieLang}`,
      { headers: this.header }
    );
  }

  // get movie review by id
  public movieReviewsById(id, listType) {
    return this.http.get(
      `${this.movieDbAPI}${listType}/${id}/reviews?api_key=${this.movieDbAPIKey}&language=${this.movieLang}&page=1`,
      { headers: this.header }
    );
  }

  // get similar movie & tv shows
  public getSimilarMoviesTV(id, listType) {
    return this.http.get(
      `${this.movieDbAPI}${listType}/${id}/similar?api_key=${this.movieDbAPIKey}&language=${this.movieLang}&page=1`,
      { headers: this.header }
    );
  }

  //search by string

  public searchByString(query) {
    return this.http.get(
      `${this.movieDbAPI}search/multi?api_key=${this.movieDbAPIKey}&language=${this.movieLang}&query=${query}&page=1&include_adult=true`,
      { headers: this.header }
    );
  }

  //discover movies/tv by genres
  public discoverByListId(pageNo, listType, genreId): Observable<Imovies> {
    return this.http.get<Imovies>(
      `${this.movieDbAPI}discover/${listType}?api_key=${this.movieDbAPIKey}&language=${this.movieLang}&sort_by=popularity.desc&include_adult=true&include_video=false&page=${pageNo}&with_genres=${genreId}`,
      { headers: this.header }
    );
  }

  //non paginated - discover movies/tv by genres
  public discoverByListIdAll(pageNo, listType, genreId): Observable<Imovies> {
    return this.http.get<Imovies>(
      `${this.movieDbAPI}discover/${listType}?api_key=${this.movieDbAPIKey}&language=${this.movieLang}&sort_by=popularity.desc&include_adult=true&include_video=false&with_genres=${genreId}`,
      { headers: this.header }
    );
  }

  //get movie credits by id
  public getMovieTvCredits(id, listType) {
    return this.http.get(
      `${this.movieDbAPI}${listType}/${id}/credits?api_key=${this.movieDbAPIKey}`,
      { headers: this.header }
    );
  }

  //get tv season details by id
  public getTvSeasonDetails(id, seasonNo) {
    return this.http.get(
      `${this.movieDbAPI}tv/${id}/season/${seasonNo}?api_key=${this.movieDbAPIKey}&language=${this.movieLang}`,
      { headers: this.header }
    );
  }

  //get movie videos by id
  public getMovieTrailersById(id, listType) {
    return this.http.get(
      `${this.movieDbAPI}${listType}/${id}/videos?api_key=${this.movieDbAPIKey}&language=${this.movieLang}`,
      { headers: this.header }
    );
  }

  //get trending movies&tv
  public getTrendingMedia(listType) {
    return this.http.get(
      `${this.movieDbAPI}trending/${listType}/week?api_key=${this.movieDbAPIKey}`,
      { headers: this.header }
    );
  }
}
