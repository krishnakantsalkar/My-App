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
import { QuillModule } from 'ngx-quill';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';

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
    QuillModule,
    CardModule,
    TabViewModule,
    CheckboxModule,
  ],
  exports: [
    FooterComponent,
    ToastModule,
    TooltipModule,
    DialogModule,
    ButtonModule,
    ConfirmDialogModule,
    SkeletonModule,
    QuillModule,
    CardModule,
    TabViewModule,
    CheckboxModule,
  ],
})
export class SharedModuleModule {}
