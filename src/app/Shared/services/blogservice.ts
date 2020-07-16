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

  public addBlogApi: string =
    'https://mybackend-1911.herokuapp.com/api/blog/AddBlog';

  public updateBlogApi: string =
    'https://mybackend-1911.herokuapp.com/api/blog/updateBlog/';

  public deleteBlogApi: string =
    'https://mybackend-1911.herokuapp.com/api/blog/deleteBlog/';

  public telegrampostApi: string = ''; // removed bot token for github upload

  constructor(private http: HttpClient, private router: Router) {
    this.header = new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  getBlogs(): Observable<Iblog> {
    return this.http.get<Iblog>(this.blogAPI);
  }

  getBlogsbyId(id): Observable<Iblog> {
    return this.http.get<Iblog>(this.blogAPI + id);
  }

  publishBlog(data): Observable<Iblog> {
    return this.http.post<Iblog>(this.addBlogApi, JSON.stringify(data), {
      headers: this.header,
    });
  }

  updateBlog(data, id): Observable<Iblog> {
    return this.http.put<Iblog>(this.updateBlogApi + id, JSON.stringify(data), {
      headers: this.header,
    });
  }

  deleteBlog(id): Observable<Iblog> {
    return this.http.delete<Iblog>(this.deleteBlogApi + id);
  }

  tgpost(title, post) {
    return this.http.post(
      this.telegrampostApi +
        '&' +
        encodeURI(`text=Title: ${title}\n\n`) +
        encodeURIComponent(`Post:\n\n${post}`),
      {
        headers: this.header,
      }
    );
  }
}
