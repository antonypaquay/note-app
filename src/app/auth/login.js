import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import AuthBase from "./auth-base";
import styles from "./auth-base.module.css";
import logo from '../../assets/img/logos/note-app-logo-256x256.png';
import googleImg from '../../assets/img/auth-providers/google-logo.png';
import githubImg from '../../assets/img/auth-providers/github-logo.png';

export default class Login extends AuthBase {
  constructor(parent) {
    super(parent);
    this.parent = parent;
    this.root = this.parent.root;
    this.root.innerHTML = `
      <section class="${styles.sectionAuth}">
        <div class="${styles.authContainer}">
          <img src="${logo}" class="${styles.authIcon}" alt="NoteApp logo"/>
          <h1 class="${styles.authTitle}">Sign in with email</h1>
          <p class="${styles.authDescription}">Make a new doc to bring your words, data, and teams together. For free</p>
          <form id="form-signup">
            <div class="${styles.authTextField}">
              <label for="email" aria-label="Your email"><span class="material-symbols-rounded" aria-hidden="true">person</span></label>
              <input type="email" id="email" placeholder="Your email">
            </div>
            <div class="${styles.authTextField}">
              <label for="password" aria-label="Your password"><span class="material-symbols-rounded" aria-hidden="true">lock</span></label>
              <input type="password" id="password" placeholder="Your password">
              <button class="${styles.authBtnVisibility}" type="button" id="btn-visibility"><span class="material-symbols-rounded">visibility</span></button>
            </div>
            <button class="${styles.authBtn} btn btn-primary" type="submit">Get started</button>
            <p class="${styles.authSeparator}"><span>Or sign in with</span></p>
            <div class="${styles.authProviders}">
              <button type="button" class="btn btn-provider" id="google"><img src="${googleImg}" alt="Google logo"></button>
              <button type="button" class="btn btn-provider" id="github"><img src="${githubImg}" alt="Github logo"></button>
            </div>
            <p class="${styles.authSwitch}">Don't have an account? <a id="switch" href="/signup">Register</a></p>
          </form>
        </div>
      </section>
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
      this._login();
    });

    changeLink.addEventListener("click", (e) => {
      e.preventDefault();
      this.parent.navigateTo("/signup");
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

  _login() {
    signInWithEmailAndPassword(auth, this.emailValue, this.passwordValue).then((userCredential) => {
      this.parent.navigateTo("/");
    });
  }
}
