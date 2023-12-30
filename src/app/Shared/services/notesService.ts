import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class noteService {
  public header: HttpHeaders;
  public clientIpApi: string = 'http://localhost:3000/api/users/getMyIp';

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
      `http://localhost:3000/api/notes/getNotes/${profileId}`
    );
  }
  postNote(data) {
    return this.http.post<any>(
      `http://localhost:3000/api/notes/postNote`,
      data
    );
  }
  editNote(id, data) {
    return this.http.put<any>(
      `http://localhost:3000/api/notes/editNote/${id}`,
      data,
      { headers: this.header }
    );
  }
  unlockNote(data) {
    return this.http.post<any>(
      `https://my-app-backend-node.vercel.app/api/notes/unlockNote/`,
      data,
      { headers: this.header }
    );
  }
  deleteNote(id) {
    return this.http.delete<any>(
      `http://localhost:3000/api/notes/deleteNote/${id}`,
      { headers: this.header }
    );
  }

  getTodo(profileId) {
    return this.http.get<any>(
      `http://localhost:3000/api/notes/getTodo/${profileId}`
    );
  }
  postTodo(data) {
    return this.http.post<any>(
      `http://localhost:3000/api/notes/postTodo`,
      data
    );
  }
  editTodo(id, data) {
    return this.http.put<any>(
      `http://localhost:3000/api/notes/editTodo/${id}`,
      data,
      { headers: this.header }
    );
  }
  deleteTodo(id) {
    return this.http.delete<any>(
      `http://localhost:3000/api/notes/deleteTodo/${id}`,
      { headers: this.header }
    );
  }

  getClientIp() {
    return this.http.get<any>(this.clientIpApi, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
