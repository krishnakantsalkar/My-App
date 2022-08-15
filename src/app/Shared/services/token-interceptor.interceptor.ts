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
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UiService } from './ui.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {
  constructor(
    private logonServices: userloginservices,
    private router: Router,
    private uiService: UiService,
    private cookies: CookieService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //something
    if (request.headers.has('skip')) {
      request = request.clone({
        headers: request.headers.delete('skip', 'true'),
      });
      return next.handle(request);
    } else {
      let token = this.cookies.get('userToken')
        ? JSON.parse(this.cookies.get('userToken'))
        : '';

      let tokenizedReq = request.clone({
        setHeaders: {
          'x-auth-token': token,
        },
      });

      return next.handle(tokenizedReq);
    }
  }
}
