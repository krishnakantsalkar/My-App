import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class authGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    let token = localStorage.getItem('credentials');
    if (!token) {
      alert('You need to login first!');
      this.router.navigateByUrl('/Home');
      return false;
    } else {
      return true;
    }
  }
}
