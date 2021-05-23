import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class noteService {
  public header: HttpHeaders;
  constructor(private http: HttpClient) {
    this.header = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth-token': JSON.parse(localStorage.getItem('userToken')),
    });
  }

  getNotes(profileId) {
    return this.http.get<any>(
      `https://mybackend-1911.herokuapp.com/api/notes/getNotes/${profileId}`
    );
  }
  postNote(data) {
    return this.http.post<any>(
      `https://mybackend-1911.herokuapp.com/api/notes/postNote`,
      data
    );
  }
  editNote(id, data) {
    return this.http.put<any>(
      `https://mybackend-1911.herokuapp.com/api/notes/editNote/${id}`,
      data,
      { headers: this.header }
    );
  }
  deleteNote(id) {
    return this.http.delete<any>(
      `https://mybackend-1911.herokuapp.com/api/notes/deleteNote/${id}`,
      { headers: this.header }
    );
  }

  getTodo(profileId) {
    return this.http.get<any>(
      `https://mybackend-1911.herokuapp.com/api/notes/getTodo/${profileId}`
    );
  }
  postTodo(data) {
    return this.http.post<any>(
      `https://mybackend-1911.herokuapp.com/api/notes/postTodo`,
      data
    );
  }
  editTodo(id, data) {
    return this.http.put<any>(
      `https://mybackend-1911.herokuapp.com/api/notes/editTodo/${id}`,
      data,
      { headers: this.header }
    );
  }
  deleteTodo(id) {
    return this.http.delete<any>(
      `https://mybackend-1911.herokuapp.com/api/notes/deleteTodo/${id}`,
      { headers: this.header }
    );
  }
}
