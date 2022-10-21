import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";
import app from "../firebase.js";

const mailField = document.getElementById("mail");
const passwordField = document.getElementById("password");
const signInWithMail = document.getElementById("signInWithMail");
const signInWithGoogleButton = document.getElementById("signInWithGoogle");
const signUp = document.getElementById("signUp");

//For Firebase (Note: gstatic link)
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

//Auth State Changed
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    console.log(uid);
    console.log(user);
    window.location.assign("./wordle.html");
    // ...
  } else {
    // User is signed out
    console.log("User Logged Out - Please sign in to continue");
  }
});

//GOOGLE SIGN-IN
const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      window.location.assign("./wordle.html");
    })
    .catch((e) => {
      console.error(e);
    });
};

signInWithGoogleButton.addEventListener("click", signInWithGoogle);

//EMAIL SIGN-IN
const signInWithEmailFunction = () => {
  const email = mailField.value;
  const password = passwordField.value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      //Signed in successfully
      window.location.assign("./wordle.html");
    })
    .catch((e) => {
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
};

signInWithMail.addEventListener("click", signInWithEmailFunction);

//SIGN-UP PAGE
signUp.addEventListener("click", () => {
  window.location.assign("./signup.html");
});
