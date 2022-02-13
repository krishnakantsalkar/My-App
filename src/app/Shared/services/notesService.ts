import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class noteService {
  public header: HttpHeaders;
  constructor(private http: HttpClient, private cookies: CookieService) {
    this.header = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth-token': this.cookies.get('userToken')
        ? JSON.parse(this.cookies.get('userToken'))
        : '',
    });
  }

  getNotes(profileId) {
    return this.http.get<any>(
      `https://my-app-backend-node.vercel.app/api/notes/getNotes/${profileId}`
    );
  }
  postNote(data) {
    return this.http.post<any>(
      `https://my-app-backend-node.vercel.app/api/notes/postNote`,
      data
    );
  }
  editNote(id, data) {
    return this.http.put<any>(
      `https://my-app-backend-node.vercel.app/api/notes/editNote/${id}`,
      data,
      { headers: this.header }
    );
  }
  deleteNote(id) {
    return this.http.delete<any>(
      `https://my-app-backend-node.vercel.app/api/notes/deleteNote/${id}`,
      { headers: this.header }
    );
  }

  getTodo(profileId) {
    return this.http.get<any>(
      `https://my-app-backend-node.vercel.app/api/notes/getTodo/${profileId}`
    );
  }
  postTodo(data) {
    return this.http.post<any>(
      `https://my-app-backend-node.vercel.app/api/notes/postTodo`,
      data
    );
  }
  editTodo(id, data) {
    return this.http.put<any>(
      `https://my-app-backend-node.vercel.app/api/notes/editTodo/${id}`,
      data,
      { headers: this.header }
    );
  }
  deleteTodo(id) {
    return this.http.delete<any>(
      `https://my-app-backend-node.vercel.app/api/notes/deleteTodo/${id}`,
      { headers: this.header }
    );
  }
}
