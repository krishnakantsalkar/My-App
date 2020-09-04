import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Imovies, ImovieDetails } from '../model/movieModel';

@Injectable({ providedIn: 'root' })
export class MovieServices {
  private movieAPI: string = 'https://api.themoviedb.org/3/movie/'; //popular movies base API
  private movieAPIKey: string = ''; //api id removed for public upload
  private movieLang: string = 'en-US'; // data language
  private moviePage: number = 1; // data page no.
  private movieListType: string = 'popular'; // movie list type

  public header: HttpHeaders;
  constructor(private http: HttpClient, private router: Router) {
    this.header = new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  // get all data from API
  public getPopularMovies(pageNo): Observable<Imovies> {
    return this.http.get<Imovies>(
      `${this.movieAPI}popular?api_key=${this.movieAPIKey}&language=${this.movieLang}&page=${pageNo}`
    );
  }

  // get single data by id
  public getMoviesById(id): Observable<ImovieDetails> {
    return this.http.get<ImovieDetails>(
      `${this.movieAPI}${id}?api_key=${this.movieAPIKey}&language=${this.movieLang}`
    );
  }

  // get movie review by id
  public movieReviewsById(id) {
    return this.http.get(
      `${this.movieAPI}${id}/reviews?api_key=${this.movieAPIKey}&language=${this.movieLang}&page=1`
    );
  }
}
