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
    //something
    if (request.headers.has('skip')) {
      request = request.clone({
        headers: request.headers.delete('skip', 'true'),
      });
      return next.handle(request);
    } else {
      let token = undefined;

      if (localStorage.getItem('userToken')) {
        token = JSON.parse(localStorage.getItem('userToken'));
      } else {
        token = '';
      }

      let tokenizedReq = request.clone({
        setHeaders: {
          'x-auth-token': token,
        },
      });

      return next.handle(tokenizedReq);
      // .pipe(
      //   map((event: HttpEvent<any>) => {
      //     console.log(event);

      //     if (event instanceof HttpErrorResponse) {
      //       if (
      //         event.status == 403 &&
      //         (event.message == 'token expired/invalid!' ||
      //           event.message == 'user not found!')
      //       ) {
      //         console.log(event);

      //         this.uiService.showSnackbar(
      //           'Auth Invalid, please login again',
      //           null,
      //           3500
      //         );

      //         this.logonServices.Logout();
      //       }
      //     }
      //     return event;
      //   })
      // );
    }
  }
}
