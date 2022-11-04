// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-9drWi3TX3xjmdcdY90HFzDuteWKCcak",
  authDomain: "angi-wordle-js.firebaseapp.com",
  projectId: "angi-wordle-js",
  storageBucket: "angi-wordle-js.appspot.com",
  messagingSenderId: "763896694665",
  appId: "1:763896694665:web:92b259c4e99d7aca260358",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
