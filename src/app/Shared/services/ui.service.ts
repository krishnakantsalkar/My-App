import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  public checkSession$ = new BehaviorSubject<boolean>(false);
  domClick$ = new Subject<any>();
  constructor(
    private snackbar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    if (!isPlatformBrowser(this.platformId)) {
    } else {
      if (sessionStorage.getItem('session')) {
        this.checkSession$.next(true);
      }
    }
  }

  public showSnackbar(message: string, action: string, duration: number) {
    this.snackbar.open(message, action, {
      verticalPosition: 'top',
      horizontalPosition: 'center',
      duration: duration,
    });
  }
}
