import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { modeService } from '../../../Shared/services/light-dark-Modeservice';
import { noteService } from '../../../Shared/services/notesService';
import { Title } from '@angular/platform-browser';
import { UiService } from 'src/app/Shared/services/ui.service';
import { SnippetsService } from '../../../Shared/services/snippets.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import * as $ from 'jquery';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
})
export class NotesComponent implements OnInit {
  brightness: boolean;
  notesData;
  noteSwitch: boolean = false;
  noteTitle;
  noteContent;

  pageTitle: string = 'Notes';
  profId = JSON.parse(localStorage.getItem('profileId'));

  todoSwitch: boolean = false;
  todoArr = [];
  todo_title;
  todo_opt;
  allTodos;
  areAllArchived: boolean = true;
  snippets: any[];
  anyNotePinned: boolean = false;
  anyTaskPinned: boolean = false;
  selectedTab = 0;
  constructor(
    private defaultModeService: modeService,
    private noteService: noteService,
    private titleService: Title,
    private uiService: UiService,
    private snippetService: SnippetsService,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // brightness mode

    this.titleService.setTitle(this.pageTitle);
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;
    });

    this.getNotes();
    this.getTodo();
    this.getSnippets();
  }

  showAddNote() {
    this.noteSwitch = !this.noteSwitch;
    this.noteTitle = undefined;
    this.noteContent = undefined;
  }

  showAddTodo() {
    this.todoSwitch = !this.todoSwitch;
    this.todoArr = [];
    this.todo_title = undefined;
    this.todo_opt = undefined;
  }

  getNotes() {
    this.noteContent = undefined;
    this.noteTitle = undefined;
    this.noteService.getNotes(this.profId).subscribe((item) => {
      this.notesData = item.result;

      if (this.notesData.length > 0) {
        this.notesData = this.notesData.reverse();
      }

      let checkArchived = this.notesData.some((item) => {
        return item.archived == false;
      });

      if (checkArchived) {
        this.areAllArchived = false;
      } else {
        this.areAllArchived = true;
      }

      this.anyNotePinned = this.notesData.some((item) => {
        return item.pinned == true;
      });
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
      notes_title: this.noteTitle,
      notes_message: this.noteContent,
      profileId: this.profId,
      readonly: true,
      pinned: false,
      archived: false,
    };

    this.noteService.postNote(noteObj).subscribe(
      (item) => {
        this.uiService.showSnackbar(`${item.message}`, null, 3500);

        this.selectedTab = 0;

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
        this.uiService.showSnackbar(`${err.error.message}`, null, 3500);

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
  }
  cancelEditNote(i) {
    this.notesData[i].readonly = true;
    this.getNotes();
  }

  updateNote(i) {
    let noteObj = this.notesData[i];

    noteObj.readonly = true;
    this.noteService.editNote(this.notesData[i]._id, noteObj).subscribe(
      (item) => {
        this.uiService.showSnackbar(`${item.message}`, null, 3500);
      },
      (err) => {
        this.uiService.showSnackbar(`${err.error.message}`, null, 3500);
      }
    );
  }

  deleteNote(i) {
    let noteObj = this.notesData[i];

    this.noteService.deleteNote(this.notesData[i]._id).subscribe(
      (item) => {
        this.uiService.showSnackbar(`${item.message}`, null, 3500);

        this.getNotes();
      },
      (err) => {
        this.uiService.showSnackbar(`${err.error.message}`, null, 3500);
      }
    );
  }

  pinNote(i, param) {
    let noteObj = this.notesData[i];

    var msg = '';
    if (param == 'pin') {
      noteObj.pinned = true;
      msg = 'pinned';
    } else if (param == 'unpin') {
      noteObj.pinned = false;
      msg = 'unpinned';
    }

    this.noteService.editNote(this.notesData[i]._id, noteObj).subscribe(
      (item) => {
        this.uiService.showSnackbar(`Note ${msg}`, null, 3500);

        this.getNotes();
      },
      (err) => {
        this.uiService.showSnackbar(`${err.error.message}`, null, 3500);
      }
    );
  }

  archive(i, param) {
    let noteObj = this.notesData[i];

    if (param == 'archive') {
      noteObj.archived = true;
      noteObj.pinned = false;
    } else {
      noteObj.archived = false;
    }
    this.noteService.editNote(this.notesData[i]._id, noteObj).subscribe(
      (item) => {
        this.uiService.showSnackbar('Note archived', null, 3500);

        this.selectedTab = 1;

        this.noteContent = undefined;
        this.getNotes();
      },
      (err) => {
        this.uiService.showSnackbar(`${err.error.message}`, null, 3500);
      }
    );
  }

  unArchive(i) {
    let noteObj = this.notesData[i];

    noteObj.archived = false;
    this.selectedTab = 0;

    this.noteService.editNote(this.notesData[i]._id, noteObj).subscribe(
      (item) => {
        this.uiService.showSnackbar('Note unarchived', null, 3500);

        this.noteContent = undefined;
        this.getNotes();
      },
      (err) => {
        this.uiService.showSnackbar(`${err.error.message}`, null, 3500);
      }
    );
  }
  // ------------------ notes end ---------------------------

  // ------------------ Todo start -------------------------
  addOption() {
    let todoStruct = {
      name: this.todo_opt,
      value: false,
    };
    this.todoArr.push(todoStruct);
    this.todo_opt = undefined;
  }

  check(event, i) {
    this.todoArr[i].value = event.checked;
  }

  updateCheck(event, i, j) {
    this.allTodos[i].todo_list[j].value = event.checked;

    let data = {
      todo_list: this.allTodos[i].todo_list,
    };

    this.noteService.editTodo(this.allTodos[i]._id, data).subscribe((item) => {
      this.getTodo();
    });
  }

  getTodo() {
    this.todo_title = undefined;
    this.todo_opt = undefined;
    this.noteService.getTodo(this.profId).subscribe((item) => {
      this.allTodos = item.result;

      if (this.allTodos.length > 0) {
        this.allTodos = this.allTodos.reverse();
      }

      this.anyTaskPinned = this.allTodos.some((item) => {
        return item.pinned == true;
      });
    });
  }

  deleteOpt(i) {
    this.todoArr.splice(i, 1);
  }

  saveTodo() {
    $('#uploadSpinner').css({
      display: 'inline-block',
    });
    $('#uploadCheckErr').css({
      display: 'none',
    });

    let todoObj = {
      todo_id: `TD${Date.now().toString()}`,
      todo_title: this.todo_title,
      todo_list: this.todoArr,
      profileId: this.profId,
      readonly: true,
      pinned: false,
    };

    this.noteService.postTodo(todoObj).subscribe(
      (item) => {
        this.uiService.showSnackbar(`${item.message}`, null, 3500);

        this.selectedTab = 2;
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
          this.getTodo();
          this.showAddTodo();
        }, 900);
      },
      (err) => {
        this.uiService.showSnackbar(`${err.error.message}`, null, 3500);

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

  deleteTodo(i) {
    this.noteService.deleteTodo(this.allTodos[i]._id).subscribe(
      (item) => {
        this.uiService.showSnackbar(`${item.message}`, null, 3500);

        this.getTodo();
      },
      (err) => {
        this.uiService.showSnackbar(`${err.error.message}`, null, 3500);
      }
    );
  }
  editTodo(i) {
    this.allTodos[i].readonly = false;
  }

  cancelEditTodo(i) {
    this.allTodos[i].readonly = true;
    this.getTodo();
  }

  addMore(i) {
    let todoStruct = {
      name: '',
      value: false,
    };
    this.allTodos[i].todo_list.push(todoStruct);
  }

  deleteEditOption(i, j) {
    this.allTodos[i].todo_list.splice(j, 1);
  }

  pinTodo(i, param) {
    let todoObj = this.allTodos[i];

    var msg = '';
    if (param == 'pin') {
      todoObj.pinned = true;
      msg = 'pinned';
    } else if (param == 'unpin') {
      todoObj.pinned = false;
      msg = 'unpinned';
    }

    this.noteService.editTodo(this.allTodos[i]._id, todoObj).subscribe(
      (item) => {
        this.uiService.showSnackbar(`Task ${msg}`, null, 3500);

        this.getTodo();
      },
      (err) => {
        this.uiService.showSnackbar(`${err.error.message}`, null, 3500);
      }
    );
  }

  updateTodo(i) {
    let data = this.allTodos[i];
    data.readonly = true;
    this.noteService.editTodo(this.allTodos[i]._id, data).subscribe(
      (item) => {
        this.uiService.showSnackbar(`${item.message}`, null, 3500);
        this.getTodo();
      },
      (err) => {
        this.uiService.showSnackbar(`${err.error.message}`, null, 3500);
      }
    );
  }

  checkAllTasks(todo) {
    return todo.todo_list.every((x) => {
      return x.value == true;
    });
  }

  calcTaskProgress(todo) {
    let taskLength = todo.todo_list.length;
    let count = 0;
    todo.todo_list.forEach((x) => {
      if (x.value == true) {
        count++;
      }
    });

    return `${Math.round((count / taskLength) * 100)}%`;
  }

  // ------------------- snippets -------------------------

  getSnippets() {
    this.snippetService.getSnippets().subscribe((item) => {
      this.snippets = item.result;
    });
  }
  deleteSnippet(id) {
    this.snippetService.deleteSnippet(id).subscribe((item) => {
      this.uiService.showSnackbar('Snippet deleted', null, 3500);
      this.getSnippets();
    });
  }

  tabChange(event) {
    if (event.index == 3) {
      this.getSnippets();
    }
  }

  copyShareLink(val) {
    if (!isPlatformBrowser(this.platformId)) {
    } else {
      const selBox = this.document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      this.document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      this.document.execCommand('copy');
      this.document.body.removeChild(selBox);

      this.uiService.showSnackbar('link copied to clipboard', null, 3500);
    }
  }
}
