import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Iblog } from '../model/blogmodel';
import { IsearchResult } from '../model/searchResult';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class blogpostservice {
  public header: HttpHeaders;
  public blogImgHeader: HttpHeaders;
  public blogAPI: string = 'http://localhost:3000/api/blog/Blog/';

  public testPage: string = 'http://localhost:3000/api/blog/Blog/page/';

  public addBlogApi: string = 'http://localhost:3000/api/blog/AddBlog';

  public uploadApi: string = 'http://localhost:3000/api/blog/blogImage';

  public updateBlogApi: string = 'http://localhost:3000/api/blog/updateBlog/';

  public deleteBlogApi: string = 'http://localhost:3000/api/blog/deleteBlog/';

  public telegrampostApi: string = ''; // removed bot token for github upload

  public searchApi: string = 'http://localhost:3000/api/blog/search';

  public postViewApi: string = 'http://localhost:3000/api/blog/postView/';

  public newsLetterApi: string =
    'http://localhost:3000/api/subscribe/newsLetterSub/';

  public searchByTagApi: string = 'http://localhost:3000/api/blog/searchByTag';

  getRecentPostsApi: string =
    'https://my-app-backend-node.vercel.app/api/blog/getRecentPosts';

  getMvApi: string = 'https://my-app-backend-node.vercel.app/api/blog/getMv';

  getPostByNumberApi: string =
    'https://my-app-backend-node.vercel.app/api/blog/getPostByNumber';

  getTagsApi: string =
    'https://my-app-backend-node.vercel.app/api/blog/getTags';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookies: CookieService
  ) {
    this.header = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth-token': this.cookies.get('userToken')
        ? JSON.parse(this.cookies.get('userToken'))
        : '',
    });

    this.blogImgHeader = new HttpHeaders({
      'x-auth-token': this.cookies.get('userToken')
        ? JSON.parse(this.cookies.get('userToken'))
        : '',
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
        'x-auth-token': this.cookies.get('userToken')
          ? JSON.parse(this.cookies.get('userToken'))
          : '',
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
      {},
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

  searchByTag(data) {
    return this.http.get<any>(`${this.searchByTagApi}?search=${data}`, {
      headers: this.header,
    });
  }

  getRecentPosts() {
    return this.http.post<any>(
      `${this.getRecentPostsApi}`,
      {},
      { headers: this.header }
    );
  }

  getMv() {
    return this.http.get<any>(`${this.getMvApi}`, { headers: this.header });
  }

  getPostByNumber(data) {
    return this.http.post<any>(`${this.getPostByNumberApi}`, data, {
      headers: this.header,
    });
  }

  getTags() {
    return this.http.get<any>(`${this.getTagsApi}`, { headers: this.header });
  }
}
