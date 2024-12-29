import NotesAPI from "./NotesAPI.js";
import NotesView from "./NotesView.js";
import Signup from "./auth/signup";
import Login from "./auth/login";
import { auth } from "./config/firebase"
import { onAuthStateChanged } from "firebase/auth";

export default class App {
  constructor(root) {
    this.root = root;
    this.notes = [];
    this.activeNote = null;
    this.userId = null;

    this.isAuthenticated();
  }

  isAuthenticated() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userId = user.uid;
        this.navigateTo("/");
      } else {
        this.navigateTo("/login");
      }
    });
  }

  navigateTo(path) {
    switch (path) {
      case "/":
        this._initNotesView();
        break;
      case "/signup":
        this._initSignUpView();
        break;
      case "/login":
        this._initLoginView();
        break;
    }
  }

  _initNotesView() {
    this.view = new NotesView(this.root, this._handlers());
    this._refreshNotes();
  }

  _initSignUpView() {
    new Signup(this);
  }

  _initLoginView() {
    new Login(this);
  }

  _refreshNotes() {
    NotesAPI.getAllNotes(this.userId).then(notes => {
      this._setNotes(notes);
      if (notes.length > 0) {
        this._setActiveNote(notes[0]);
      }
    });
  }

  _setNotes(notes) {
    this.notes = notes;
    this.view.updateNoteList(notes);
    this.view.updateNotePreviewVisibility(notes.length > 0);
  }

  _setActiveNote(note) {
    this.activeNote = note;
    this.view.updateActiveNote(note);
  }

  _handlers() {
    return {
      onNoteSelect: noteId => {
        const selectedNote = this.notes.find(note => note.id === noteId);
        this._setActiveNote(selectedNote);
      },
      onNoteAdd: () => {
        const newNote = {
          userId: this.userId,
          title: "New note",
          body: "Take note..."
        }
        NotesAPI.saveNote(this.userId, newNote).then(() => {
          this._refreshNotes();
        });
      },
      onNoteEdit: (title, body) => {
        const self = this;
        const data = {
          id: this.activeNote.id,
          title: title,
          body: body
        }
        NotesAPI.saveNote(self.userId, data).then(function () {
          self._refreshNotes();
        });
      },
      onNoteDelete: noteId => {
        const self = this;
        NotesAPI.deleteNote(this.userId, noteId).then(function () {
          self._refreshNotes();
        });
      }
    };
  }
}
