import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IuserLogin } from 'src/app/Shared/model/loginmodel';

@Injectable({ providedIn: 'root' })
export class userloginservices {
  public loginAPI: string =
    'https://mybackend-1911.herokuapp.com/api/users/login';

  public profileAPI: string =
    'https://mybackend-1911.herokuapp.com/api/users/getUsers/';

  public profilePicAPI: string =
    'https://mybackend-1911.herokuapp.com/api/users/editProfImg/';

  public header: HttpHeaders;
  constructor(private http: HttpClient, private router: Router) {
    this.header = new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  Login(data: IuserLogin): Observable<IuserLogin> {
    return this.http.post<IuserLogin>(this.loginAPI, JSON.stringify(data), {
      headers: this.header,
    });
  }
  Logout() {
    localStorage.removeItem('credentials');
    localStorage.removeItem('id');
    this.router.navigateByUrl('/Home');
  }

  getUsersById(id) {
    return this.http.get(this.profileAPI + id);
  }

  updateProfPic(data, id) {
    return this.http.put(this.profilePicAPI + id, data);
  }
}
