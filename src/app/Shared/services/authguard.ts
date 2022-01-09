import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UiService } from './ui.service';
import { userloginservices } from './userloginservice';

@Injectable({ providedIn: 'root' })
export class authGuard implements CanActivate {
  constructor(
    private router: Router,
    private cookies: CookieService,
    private uiService: UiService,
    private logonServices: userloginservices
  ) {}

  canActivate() {
    // let token = localStorage.getItem('credentials');
    let token = JSON.parse(localStorage.getItem('userToken'));
    if (!token) {
      this.uiService.showSnackbar('You need to login first!', null, 3500);
      this.router.navigateByUrl('/home');
      return false;
    } else {
      return new Promise<boolean>((resolve, reject) => {
        this.logonServices.verifyAuth(token).subscribe(
          (item) => {
            if (item) {
              return resolve(true);
            }
          },
          (err) => {
            this.logonServices.Logout();
            this.uiService.showSnackbar('unauthorized access', null, 3500);
            return resolve(false);
          }
        );
      });
    }
  }
}
