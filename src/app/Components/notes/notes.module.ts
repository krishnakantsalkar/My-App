import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesComponent } from './notes/notes.component';
import { RouterModule } from '@angular/router';
import { notesRoutes } from './notes-route';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [NotesComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(notesRoutes),
    SharedModuleModule,
  ],
})
export class NotesModule {}
