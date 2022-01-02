import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { userloginservices } from './userloginservice';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UiService } from './ui.service';

@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {
  constructor(
    private logonServices: userloginservices,
    private router: Router,
    private uiService: UiService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = undefined;

    if (localStorage.getItem('token')) {
      token = JSON.parse(localStorage.getItem('userToken'));
    } else {
      token = '';
    }

    let tokenizedReq = request.clone({
      setHeaders: {
        'x-auth-token': token,
      },
    });

    return next.handle(tokenizedReq).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          this.uiService.showSnackbar(
            'Auth Invalid, please login again',
            null,
            3500
          );

          this.logonServices.Logout();
        }
        return throwError(err);
      })
    );
  }
}
