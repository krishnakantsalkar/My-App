import { Component, OnInit, Inject } from '@angular/core';
import { modeService } from '../../../Shared/services/light-dark-Modeservice';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
})
export class ConfirmationDialogComponent implements OnInit {
  brightness: boolean;
  confirmData: any;
  constructor(
    private defaultModeService: modeService,
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    // brightness mode
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;
    });

    this.confirmData = this.data;
  }

  confirmTrue() {
    this.dialogRef.close({
      confirm: true,
    });
  }
}
