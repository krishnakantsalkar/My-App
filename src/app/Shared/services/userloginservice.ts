import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IuserLogin } from 'src/app/Shared/model/loginmodel';
import { CookieService } from 'ngx-cookie-service';
import { Iforgot } from '../model/forgotPass';

@Injectable({ providedIn: 'root' })
export class userloginservices {
  public loginAPI: string =
    'https://my-app-backend-node.vercel.app/api/users/login';

  public profileAPI: string =
    'https://my-app-backend-node.vercel.app/api/users/getUsers/';

  public profilePicAPI: string =
    'https://my-app-backend-node.vercel.app/api/users/editProfImg/';

  public forgotPassAPI: string =
    'https://my-app-backend-node.vercel.app/api/reset/resetMailer';

  public resetPassAPI: string =
    'https://my-app-backend-node.vercel.app/api/reset/forgotPassword/';

  public verifyCaptcha: string =
    'https://my-app-backend-node.vercel.app/api/users/verifyCaptcha';

  public verifyAuthApi: string =
    'https://my-app-backend-node.vercel.app/api/users/verifyAuth';

  public header: HttpHeaders;
  public loggedIn: BehaviorSubject<any>;
  public currentUsers: Observable<any>;
  constructor(
    private http: HttpClient,
    private router: Router,
    private cookies: CookieService
  ) {
    this.header = new HttpHeaders({ 'Content-Type': 'application/json' });
    //  behavior subject for login/logout
    this.loggedIn = new BehaviorSubject<any>(this.cookies.get('userToken'));
    this.currentUsers = this.loggedIn.asObservable();
  }

  Login(data: IuserLogin): Observable<IuserLogin> {
    return this.http
      .post<IuserLogin>(this.loginAPI, JSON.stringify(data), {
        headers: this.header,
      })
      .pipe(
        map((item) => {
          this.loggedIn.next(item);
          return item;
        })
      );
  }

  Logout() {
    // localStorage.removeItem('userToken');
    this.cookies.delete('userToken');
    localStorage.removeItem('user');
    localStorage.removeItem('id');
    localStorage.removeItem('profileId');
    // localStorage.removeItem('userToken');
    this.loggedIn.next(null);
    this.router.navigate(['/login']);
  }

  getUsersById(id) {
    return this.http.get(this.profileAPI + id);
  }

  updateProfPic(data, id) {
    return this.http.put(this.profilePicAPI + id, data);
  }

  forgotPassMailer(data): Observable<Iforgot> {
    return this.http.post<Iforgot>(this.forgotPassAPI, JSON.stringify(data), {
      headers: this.header,
    });
  }

  resetPass(data, id): Observable<Iforgot> {
    return this.http.post<Iforgot>(
      this.resetPassAPI + id,
      JSON.stringify(data),
      { headers: this.header }
    );
  }

  verifyRecaptcha(data) {
    return this.http.post(this.verifyCaptcha, data);
  }

  verifyAuth(token) {
    return this.http.post(this.verifyAuthApi, { token });
  }
}
