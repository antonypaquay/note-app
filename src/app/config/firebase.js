import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAJHos7Hq5jcAwpJxHrA06TcnDfoNH62Sg",
  authDomain: "noteapp-42f42.firebaseapp.com",
  projectId: "noteapp-42f42",
  storageBucket: "noteapp-42f42.firebasestorage.app",
  messagingSenderId: "199981280339",
  appId: "1:199981280339:web:ddbae0d0d50cb2d3d62aa6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
