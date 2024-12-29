import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebase";

export default class AuthBase {
  emailValue = "";
  passwordValue = "";

  constructor(parent) {
    this.parent = parent;
  }

  _signInWithGithub() {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
      this.parent.navigateTo("/");
    }).catch((error) => {
      throw new Error(error.message);
    });
  }

  _signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      this.parent.navigateTo("/");
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
  }
}
