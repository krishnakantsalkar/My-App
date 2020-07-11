import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JsonPipe } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class clientIpService {
  public header: HttpHeaders;
  public clienIpApi: string = 'http://api.ipify.org/?format=json';
  constructor(private http: HttpClient) {
    this.header = new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  getClientIp() {
    return this.http.get(this.clienIpApi);
  }
}
