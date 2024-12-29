import { doc, collection, setDoc, getDocs, deleteDoc, updateDoc, where, query } from "firebase/firestore";
import { db } from "./config/firebase";

export default class NotesAPI {

  static async getAllNotes(userId) {
    let notes = [];
    try {
      const q = query(collection(db, "notes"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        notes.push(doc.data());
      });
      return notes.sort((a, b) => {
        return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async saveNote(userId, noteToSave) {
    await this.getAllNotes(userId).then(async (notes) => {
      const existing = notes.find(note => note.id === noteToSave.id);
      if (existing) {
        try {
          const docRef = doc(db, "notes", existing.id);
          await updateDoc(docRef, {
            title: noteToSave.title,
            body: noteToSave.body,
            updated: new Date().toISOString()
          });
        } catch (error) {
          throw new Error(error.message);
        }
      } else {
        try {
          const notesCollectionRef = doc(collection(db, "notes"));
          noteToSave.id = notesCollectionRef.id;
          noteToSave.updated = new Date().toISOString();
          await setDoc(notesCollectionRef, { ...noteToSave, userId });
        } catch (error) {
          throw new Error(error.message);
        }
      }
    });
  }

  static async deleteNote(userId, noteId) {
    const noteDocRef = doc(db, "notes", noteId);
    try {
      await deleteDoc(noteDocRef);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
