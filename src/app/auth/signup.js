import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import AuthBase from "./auth-base";

export default class Signup extends AuthBase {
  constructor(parent) {
    super(parent);
    this.parent = parent;
    this.root = this.parent.root;
    this.root.innerHTML = `
      <h1>Create a new account</h1>
      <form id="form-signup">
        <p>
          <label for="email">Your email</label>
          <input type="email" id="email" placeholder="Type your email">
        </p>
        <p>
          <label for="password">Your password</label>
          <input type="password" id="password" placeholder="Type your password">
        </p>
        <button type="submit">Create my account</button>
        <a href="/login" id="switch">Already have account?</a>
        <hr>
        <button type="button" id="google">Connect with Google</button>
        <button type="button" id="github">Connect with Github</button>
      </form>
    `;
    this._initEvents();
  }

  _initEvents() {
    const formElt = this.root.querySelector("#form-signup");
    const emailInputElt = this.root.querySelector("input#email");
    const passwordInputElt = this.root.querySelector("input#password");
    const changeLink = this.root.querySelector("a#switch");
    const googleBtn = this.root.querySelector("button#google");
    const githubBtn = this.root.querySelector("button#github");

    [emailInputElt, passwordInputElt].forEach(inputField => {
      inputField.addEventListener("change", (_) => {
        this.emailValue = emailInputElt.value;
        this.passwordValue = passwordInputElt.value;
      })
    });

    formElt.addEventListener("submit", (e) => {
      e.preventDefault();
      this._signUp();
    });

    changeLink.addEventListener("click", (e) => {
      e.preventDefault();
      this.parent.navigateTo("/login");
    });

    googleBtn.addEventListener("click", (_) => {
      this._signInWithGoogle();
    });

    githubBtn.addEventListener("click", (_) => {
      this._signInWithGithub();
    });
  }

  _signUp() {
    createUserWithEmailAndPassword(auth, this.emailValue, this.passwordValue).then((userCredential) => {
      this.parent.navigateTo("/");
    });
  }
}
