import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IcontactUs } from '../model/contactUsmodel';

@Injectable({ providedIn: 'root' })
export class contactService {
  public header: HttpHeaders;
  public contactAPI: string = 'http://localhost:3000/api/contact/contactUs';
  constructor(private http: HttpClient) {
    {
      this.header = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
  }
  contact(data): Observable<IcontactUs> {
    return this.http.post<IcontactUs>(this.contactAPI, JSON.stringify(data), {
      headers: this.header,
    });
  }
}
