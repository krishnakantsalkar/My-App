import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Shared module

@NgModule({
  declarations: [FooterComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  exports: [FooterComponent],
})
export class SharedModuleModule {}
