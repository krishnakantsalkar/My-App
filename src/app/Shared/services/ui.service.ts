import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  public checkSession$ = new BehaviorSubject<boolean>(false);
  constructor() {
    if (sessionStorage.getItem('session')) {
      this.checkSession$.next(true);
    }
  }
}
