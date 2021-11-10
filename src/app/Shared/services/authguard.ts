import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class authGuard implements CanActivate {
  constructor(private router: Router, private cookies: CookieService) {}

  canActivate() {
    // let token = localStorage.getItem('credentials');
    let token = this.cookies.get('credentials');
    if (!token) {
      alert('You need to login first!');
      this.router.navigateByUrl('/home');
      return false;
    } else {
      return true;
    }
  }
}
