import App from "./App.js";
import "./config/firebase.js";

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const root = document.getElementById("app");
const app = new App(root);
