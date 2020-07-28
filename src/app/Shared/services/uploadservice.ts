import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class uploadservices {
  public header: HttpHeaders;

  public uploadApi: string =
    'https://mybackend-1911.herokuapp.com/api/file/fileUpload';
  constructor(private http: HttpClient) {
    this.header = new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  uploadImg(data) {
    return this.http.post(this.uploadApi, data);
  }
}
