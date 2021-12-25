import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  public checkSession$ = new BehaviorSubject<boolean>(false);
  constructor(private snackbar: MatSnackBar) {
    if (sessionStorage.getItem('session')) {
      this.checkSession$.next(true);
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
