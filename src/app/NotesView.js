import { signOut } from "firebase/auth";
import { auth } from "./config/firebase";
import { marked } from "marked";
import logo from '../assets/img/logos/note-app-logo-256x256.png';
import styles from "./NotesView.module.css";

export default class NotesView {
  constructor(root, { onNoteSelect, onNoteAdd, onNoteSave, onNoteDelete } = {}) {
    this.root = root;
    this.onNoteSelect = onNoteSelect;
    this.onNoteAdd = onNoteAdd;
    this.onNoteSave = onNoteSave;
    this.onNoteDelete = onNoteDelete;
    this.root.innerHTML = `
      <aside class="${styles.NotesSidebar}">
        <header>
          <img src="${logo}" class="${styles.authIcon}" alt="NoteApp logo"/>
        </header>
        <ul id="notes-list"></ul>
        <footer>
          <button class="btn btn-primary" id="btn-add" type="button">Add Note</button>
          <button type="button" class="btn" id="logout">Log out<span class="material-symbols-rounded">logout</span></button>
        </footer>
      </aside>
      <section class="${styles.NotePreview}">
        <header class="${styles.NotePreviewHeader}">
          <input class="${styles.NotePreviewHeaderTitle}" id="note-title" type="text" required placeholder="Type a note title">
        </header>
        <div class="${styles.NotePreviewBody}">
          <textarea id="note-body" placeholder="Start writing a note with markdown.."></textarea>
          <div id="note-result" class="${styles.NotePreviewBodyResult}">Résultat</div>
        </div>
      </section>
    `;

    this.noteContainer = this.root.querySelector(`section.${styles.NotePreview}`);
    const btnAdd = this.root.querySelector("#btn-add");
    const btnLogout = this.root.querySelector("#logout");
    const inpTitle = this.root.querySelector("#note-title");
    const inpBody = this.root.querySelector("#note-body");
    const result = this.root.querySelector("#note-result");

    btnAdd.addEventListener('click', () => {
      this.onNoteAdd();
    });

    btnLogout.addEventListener('click', () => {
      signOut(auth).then(() => {
        console.log("Logged out");
      });
    });

    [inpTitle, inpBody].forEach(inputField => {
      inputField.addEventListener("blur", () => {
        const updatedTitle = inpTitle.value.trim();
        const updatedBody = inpBody.value.trim();

        this.onNoteSave(updatedTitle, updatedBody);
      })
    });

    [inpTitle, inpBody].forEach(inputField => {
      inputField.addEventListener("input", () => {
        const updatedBody = inpBody.value.trim();

        result.innerHTML = marked.parse(updatedBody);
      })
    });

    this.updateNotePreviewVisibility(false);
  }

  updateNoteList(notes) {
    const notesListContainer = this.root.querySelector('#notes-list');

    // Empty list
    notesListContainer.innerHTML = "";

    for (const note of notes) {
      const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));

      notesListContainer.insertAdjacentHTML('beforeend', html);
    }

    // Add select/delete events for each list item
    notesListContainer.querySelectorAll("li").forEach(noteListItem => {
      noteListItem.addEventListener("click", () => {
        this.onNoteSelect(noteListItem.dataset.noteId);
      });

      noteListItem.addEventListener("dblclick", () => {
        const doDelete = confirm("Are you sure you want to delete this note?");

        if (doDelete) {
          this.onNoteDelete(noteListItem.dataset.noteId);
        }
      });
    });
  }

  updateActiveNote(note) {
    this.root.querySelector("#note-title").value = note.title;
    this.root.querySelector("#note-body").value = note.body;
    this.root.querySelector("#note-result").innerHTML = marked.parse(note.body);

    this.root.querySelectorAll("#notes-list>li").forEach(noteListItem => {
      noteListItem.classList.remove(styles.NoteListItemSelected);
    });

    const selectedNote = this.root.querySelector(`#notes-list>li[data-note-id="${note.id}"]`);
    selectedNote.classList.add(styles.NoteListItemSelected);
  }

  updateNotePreviewVisibility(visible) {
    this.noteContainer.style.visibility = visible ? "visible" : "hidden";
  }

  _createListItemHTML(id, title, body, updated) {
    const MAX_BODY_LENGTH = 60;

    return `
      <li class="${styles.NoteListItem}" data-note-id="${id}">
        <h3 class="${styles.NoteTitle}">${title}</h3>
        <p class="${styles.NoteBody}">
          ${body.substring(0, MAX_BODY_LENGTH)}
          ${body.length > MAX_BODY_LENGTH ? "..." : ""}
        </p>
        <small class="${styles.NoteUpdated}">
          ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
        </small>
      </li>
    `
  }
}
