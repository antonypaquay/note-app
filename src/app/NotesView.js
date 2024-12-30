import { signOut } from "firebase/auth";
import { auth } from "./config/firebase";

export default class NotesView {
  constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
    this.root = root;
    this.onNoteSelect = onNoteSelect;
    this.onNoteAdd = onNoteAdd;
    this.onNoteEdit = onNoteEdit;
    this.onNoteDelete = onNoteDelete;
    this.root.innerHTML = `
      <div class="notes__sidebar">
        <div>
          <button class="btn btn-primary notes__add" type="button">Add Note</button>
          <div class="notes__list"></div>
        </div>
        <button type="button" class="btn" id="logout">Log out<span class="material-symbols-rounded">logout</span></button>
      </div>
      <div class="notes__preview">
        <input class="notes__title" type="text" placeholder="Enter a title...">
        <textarea class="notes__body">I am the note body...</textarea>
      </div>
    `;

    const btnAdd = this.root.querySelector(".notes__add");
    const btnLogout = this.root.querySelector("#logout");
    const inpTitle = this.root.querySelector(".notes__title");
    const inpBody = this.root.querySelector(".notes__body");

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

        this.onNoteEdit(updatedTitle, updatedBody);
      })
    });

    this.updateNotePreviewVisibility(false);
  }

  updateNoteList(notes) {
    const notesListContainer = this.root.querySelector('.notes__list');

    // Empty list
    notesListContainer.innerHTML = "";

    for (const note of notes) {
      const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));

      notesListContainer.insertAdjacentHTML('beforeend', html);
    }

    // Add select/delete events for each list item
    notesListContainer.querySelectorAll(".notes__list-item").forEach(noteListItem => {
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
    this.root.querySelector(".notes__title").value = note.title;
    this.root.querySelector(".notes__body").value = note.body;

    this.root.querySelectorAll(".notes__list-item").forEach(noteListItem => {
      noteListItem.classList.remove("notes__list-item--selected");
    });

    this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add("notes__list-item--selected");
  }

  updateNotePreviewVisibility(visible) {
    this.root.querySelector(".notes__preview").style.visibility = visible ? "visible" : "hidden";
  }

  _createListItemHTML(id, title, body, updated) {
    const MAX_BODY_LENGTH = 60;

    return `
      <div class="notes__list-item" data-note-id="${id}">
        <h3 class="notes__small-title">${title}</h3>
        <p class="notes__small-body">
          ${body.substring(0, MAX_BODY_LENGTH)}
          ${body.length > MAX_BODY_LENGTH ? "..." : ""}
        </p>
        <small class="notes__small-updated">
          ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
        </small>
      </div>
    `
  }
}
