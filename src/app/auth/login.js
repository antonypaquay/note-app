import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import AuthBase from "./auth-base";

export default class Login extends AuthBase {
  constructor(parent) {
    super(parent);
    this.parent = parent;
    this.root = this.parent.root;
    this.root.innerHTML = `
      <h1>Connect to your account</h1>
      <form id="form-signup">
        <p>
          <label for="email">Your email</label>
          <input type="email" id="email" placeholder="Type your email">
        </p>
        <p>
          <label for="password">Your password</label>
          <input type="password" id="password" placeholder="Type your password">
        </p>
        <button type="submit">Login</button>
        <p>Don't have an account have yet? <a id="switch" href="/signup">Register</a></p>
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
      this._login();
    });

    changeLink.addEventListener("click", (e) => {
      e.preventDefault();
      this.parent.navigateTo("/signup");
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
