import { Component, OnInit } from '@angular/core';
import { modeService } from '../../../Shared/services/light-dark-Modeservice';
import { noteService } from '../../../Shared/services/notesService';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
  providers: [MessageService],
})
export class NotesComponent implements OnInit {
  brightness: boolean;
  notesData;
  noteSwitch: boolean = false;
  noteTitle;
  noteContent;

  profId = JSON.parse(localStorage.getItem('profileId'));
  constructor(
    private defaultModeService: modeService,
    private noteService: noteService,
    private messagingService: MessageService
  ) {}

  ngOnInit(): void {
    // brightness mode

    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;
    });

    this.getNotes();
  }

  showAddNote() {
    this.noteSwitch = !this.noteSwitch;
  }

  getNotes() {
    this.noteContent = undefined;
    this.noteTitle = undefined;
    this.noteService.getNotes(this.profId).subscribe((item) => {
      this.notesData = item.result;
      console.log(this.notesData);
    });
  }

  saveNote() {
    $('#uploadSpinner').css({
      display: 'inline-block',
    });
    $('#uploadCheckErr').css({
      display: 'none',
    });

    let noteObj = {
      notes_id: `NT${Date.now().toString()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      notes_title: this.noteTitle,
      notes_message: this.noteContent,
      profileId: this.profId,
      readonly: true,
      pinned: false,
      archived: false,
    };

    this.noteService.postNote(noteObj).subscribe(
      (item) => {
        this.messagingService.add({
          key: 'clipboard',
          severity: 'success',
          summary: `${item.message}`,
        });
        $('#uploadSpinner').css({
          display: 'none',
        });
        $('#uploadCheckErr').css({
          display: 'none',
        });
        $('#uploadCheck').css({
          display: 'inline-block',
        });

        setTimeout(() => {
          $('#uploadCheck').css({
            display: 'none',
          });
          this.getNotes();
          this.showAddNote();
        }, 900);
      },
      (err) => {
        this.messagingService.add({
          key: 'clipboard',
          severity: 'success',
          summary: `${err.error.message}`,
        });
        $('#uploadSpinner').css({
          display: 'none',
        });
        $('#uploadCheck').css({
          display: 'none',
        });
        $('#uploadCheckErr').css({
          display: 'inline-block',
        });
      }
    );
  }

  clickEditNote(i) {
    this.notesData[i].readonly = false;
    console.log(this.notesData[i]);
  }
  cancelEditNote(i) {
    this.notesData[i].readonly = true;
  }

  updateNote(i) {
    let noteObj = this.notesData[i];

    noteObj.updatedAt = new Date();
    noteObj.readonly = true;
    this.noteService.editNote(this.notesData[i]._id, noteObj).subscribe(
      (item) => {
        this.messagingService.add({
          key: 'clipboard',
          severity: 'info',
          summary: `${item.message}`,
        });

        console.log(item);
      },
      (err) => {
        this.messagingService.add({
          key: 'clipboard',
          severity: 'info',
          summary: `${err.error.message}`,
        });
      }
    );
  }

  deleteNote(i) {
    let noteObj = this.notesData[i];

    this.noteService.deleteNote(this.notesData[i]._id).subscribe(
      (item) => {
        this.messagingService.add({
          key: 'clipboard',
          severity: 'warn',
          summary: `${item.message}`,
          life: 300000,
        });
        this.getNotes();
      },
      (err) => {
        this.messagingService.add({
          key: 'clipboard',
          severity: 'success',
          summary: `${err.error.message}`,
        });
      }
    );
  }

  pinNote(i, param) {
    let noteObj = this.notesData[i];

    noteObj.updatedAt = new Date();
    var msg = '';
    if (param == 'pin') {
      noteObj.pinned = true;
      msg = 'pinned';
    } else if (param == 'unpin') {
      noteObj.pinned = false;
      msg = 'unpinned';
    }
    console.log(noteObj);

    this.noteService.editNote(this.notesData[i]._id, noteObj).subscribe(
      (item) => {
        this.messagingService.add({
          key: 'clipboard',
          severity: 'success',
          summary: `Note ${msg}`,
        });
        this.getNotes();
      },
      (err) => {
        this.messagingService.add({
          key: 'clipboard',
          severity: 'success',
          summary: `${err.error.message}`,
        });
      }
    );
  }

  archive(i, param) {
    let noteObj = this.notesData[i];

    noteObj.updatedAt = new Date();
    if (param == 'archive') {
      noteObj.archived = true;
    } else {
      noteObj.archived = false;
    }
    this.noteService.editNote(this.notesData[i]._id, noteObj).subscribe(
      (item) => {
        this.messagingService.add({
          key: 'clipboard',
          severity: 'success',
          summary: 'Note pinned',
        });
        this.noteContent = undefined;
        this.getNotes();
      },
      (err) => {
        this.messagingService.add({
          key: 'clipboard',
          severity: 'success',
          summary: `${err.error.message}`,
        });
      }
    );
  }
  // ------------------ notes end ---------------------------
}
