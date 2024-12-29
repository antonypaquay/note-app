import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import AuthBase from "./auth-base";
import styles from "./auth-base.module.css";
import logo from '../../assets/img/logos/note-app-logo-256x256.png';
import googleImg from '../../assets/img/auth-providers/google-logo.png';
import githubImg from '../../assets/img/auth-providers/github-logo.png';

export default class Signup extends AuthBase {
  constructor(parent) {
    super(parent);
    this.parent = parent;
    this.root = this.parent.root;
    this.root.innerHTML = `
      <section class="${styles.sectionAuth}">
        <div class="${styles.authContainer}">
          <img src="${logo}" class="${styles.authIcon}" alt="NoteApp logo"/>
          <h1 class="${styles.authTitle}">Create a new account</h1>
          <p class="${styles.authDescription}">Make a new doc to bring your words, data, and teams together. For free</p>
          <form id="form-signup">
            <div class="${styles.authTextField}">
              <label for="email"><span class="material-symbols-rounded" aria-label="Your email">person</span></label>
              <input type="email" id="email" placeholder="Your email">
            </div>
            <div class="${styles.authTextField}">
              <label for="password"><span class="material-symbols-rounded" aria-label="Your password">lock</span></label>
              <input type="password" id="password" placeholder="Your password">
              <button class="${styles.authBtnVisibility}" type="button" id="btn-visibility"><span class="material-symbols-rounded">visibility</span></button>
            </div>
            <button type="submit" class="${styles.authBtn} btn btn-primary">Create my account</button>
            <p class="${styles.authSeparator}"><span>Or register with</span></p>
            <div class="${styles.authProviders}">
              <button type="button" class="btn btn-provider" id="google"><img src="${googleImg}" alt="Google logo"></button>
              <button type="button" class="btn btn-provider" id="github"><img src="${githubImg}" alt="Github logo"></button>
            </div>
            <p class="${styles.authSwitch}">Already have account? <a id="switch" href="/login">Sign In</a></p>
          </form>
      </div>
    `;
    this._initEvents();
  }

  _initEvents() {
    const formElt = this.root.querySelector("#form-signup");
    const emailInputElt = this.root.querySelector("input#email");
    const passwordInputElt = this.root.querySelector("input#password");
    const changeLink = this.root.querySelector("a#switch");
    const pwdVisibilityBtn = this.root.querySelector("button#btn-visibility");
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

    pwdVisibilityBtn.addEventListener("click", (e) => {
      const icon = pwdVisibilityBtn.querySelector(".material-symbols-rounded");
      if (passwordInputElt.type === "password") {
        passwordInputElt.type = "text";
        icon.innerText = "visibility_off";
      } else {
        passwordInputElt.type = "password";
        icon.innerText = "visibility";
      }
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
