import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Iblog } from '../model/blogmodel';

@Injectable({ providedIn: 'root' })
export class blogpostservice {
  public header: HttpHeaders;
  public blogAPI: string =
    'https://mybackend-1911.herokuapp.com/api/blog/Blog/';
  constructor(private http: HttpClient, private router: Router) {
    this.header = new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  getBlogs(): Observable<Iblog> {
    return this.http.get<Iblog>(this.blogAPI);
  }

  getBlogsbyId(id): Observable<Iblog> {
    return this.http.get<Iblog>(this.blogAPI + id);
  }
}
