import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Iblog } from '../model/blogmodel';
import { IsearchResult } from '../model/searchResult';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class blogpostservice {
  public header: HttpHeaders;
  public blogImgHeader: HttpHeaders;
  public blogAPI: string =
    'https://mybackend-1911.herokuapp.com/api/blog/Blog/';

  public testPage: string =
    'https://mybackend-1911.herokuapp.com/api/blog/Blog/page/';

  public addBlogApi: string =
    'https://mybackend-1911.herokuapp.com/api/blog/AddBlog';

  public uploadApi: string =
    'https://mybackend-1911.herokuapp.com/api/blog/blogImage';

  public updateBlogApi: string =
    'https://mybackend-1911.herokuapp.com/api/blog/updateBlog/';

  public deleteBlogApi: string =
    'https://mybackend-1911.herokuapp.com/api/blog/deleteBlog/';

  public telegrampostApi: string = ''; // removed bot token for github upload

  public searchApi: string =
    'https://mybackend-1911.herokuapp.com/api/blog/search';

  public postViewApi: string =
    'https://mybackend-1911.herokuapp.com/api/blog/postView/';

  public newsLetterApi: string =
    'https://mybackend-1911.herokuapp.com/api/subscribe/newsLetterSub/';

  constructor(private http: HttpClient, private router: Router) {
    this.header = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth-token': JSON.parse(localStorage.getItem('userToken')),
    });

    this.blogImgHeader = new HttpHeaders({
      'x-auth-token': JSON.parse(localStorage.getItem('userToken')),
    });
  }

  getBlogs(): Observable<Iblog> {
    return this.http.get<Iblog>(this.blogAPI);
  }

  getBlogsP(pg, year?): Observable<Iblog> {
    if (year) {
      return this.http.get<Iblog>(this.testPage + pg + `?y=${year}`);
    } else if (!year) {
      return this.http.get<Iblog>(this.testPage + pg);
    }
  }

  getBlogsbyId(id): Observable<Iblog> {
    return this.http.get<Iblog>(this.blogAPI + id);
  }

  publishBlog(data): Observable<Iblog> {
    return this.http.post<Iblog>(this.addBlogApi, JSON.stringify(data), {
      headers: this.header,
    });
  }

  uploadImg(data) {
    return this.http.post<any>(this.uploadApi, data, {
      headers: {
        'x-auth-token': JSON.parse(localStorage.getItem('userToken')),
      },
    });
  }

  updateBlog(data, id): Observable<Iblog> {
    return this.http.put<Iblog>(this.updateBlogApi + id, JSON.stringify(data), {
      headers: this.header,
    });
  }

  deleteBlog(id): Observable<Iblog> {
    return this.http.delete<Iblog>(this.deleteBlogApi + id, {
      headers: this.header,
    });
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
  searchBlog(data: string): Observable<any> {
    return this.http.get<any>(this.searchApi + `?query=${data}`);
  }

  trackPostViews(id, data) {
    return this.http.put(
      this.postViewApi + id,
      JSON.stringify({ userViews: data }),
      {
        headers: this.header,
      }
    );
  }

  subscribeNewsLetter(data) {
    return this.http.post(this.newsLetterApi, JSON.stringify(data), {
      headers: this.header,
    });
  }
}
