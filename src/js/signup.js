import { app } from "./firebase.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";

const nameField = document.getElementById("name");
const mailField = document.getElementById("mail");
const passwordField = document.getElementById("password");
const signUp = document.getElementById("signUp");
const backToLogin = document.getElementById("backToLogin");

const auth = getAuth(app);

function signUpFunction() {
  const name = nameField.value;
  const email = mailField.value;
  const password = passwordField.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(function () {
      updateProfile(auth.currentUser, {
        displayName: name,
      })
        .then(function () {
          alert("Account Successfully Created !");
          window.location.assign("./");
        })
        .catch(function (e) {
          console.log(e);
        });
    })
    .catch(function (e) {
      //Error codes from Firebase Documentation
      if (e.code === "auth/email-already-in-use") {
        alert("email already in use!");
      } else if (e.code === "auth/invalid-email") {
        alert("invalid E-mail format!");
      } else if (e.code === "auth/invalid-password") {
        alert("invalid password format!");
      } else if (e.code === "auth/user-not-found") {
        alert("user not found!");
      } else if (e.code === "auth/wrong-password") {
        alert("wrong password!");
      } else if (e.code === "auth/unauthorized-continue-uri") {
        alert("whitelist the domain in firebase!");
      } else if (e.code === "auth/internal-error") {
        alert("double-check creditentials!");
      } else if (e.code === "auth/network-request-failed") {
        alert("without network connection!");
      }
      console.log(e);
    });
}

signUp.addEventListener("click", signUpFunction);

backToLogin.addEventListener("click", function () {
  window.location.assign("./");
});
