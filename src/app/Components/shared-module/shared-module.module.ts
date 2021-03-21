import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SkeletonModule } from 'primeng/skeleton';

// Shared module

@NgModule({
  declarations: [FooterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ToastModule,
    TooltipModule,
    DialogModule,
    ButtonModule,
    ConfirmDialogModule,
    SkeletonModule,
  ],
  exports: [
    FooterComponent,
    ToastModule,
    TooltipModule,
    DialogModule,
    ButtonModule,
    ConfirmDialogModule,
    SkeletonModule,
  ],
})
export class SharedModuleModule {}
