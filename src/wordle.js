import { testDictionary, realDictionary } from "./dictionary.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";
import { app, database } from "../firebase.js";
import {
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  doc,
  updateDoc,
  query,
  orderBy,
  limit,
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js";

// console.log("test dictionary:", testDictionary);

const keys = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "ENTER",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "BKSP",
];

const auth = getAuth(app);
const dictionary = realDictionary;
let secret;
const state = {
  secret: dictionary[Math.floor(Math.random() * dictionary.length)],
  grid: Array(6)
    .fill()
    .map(() => Array(5).fill("")),
  currentRow: 0,
  currentCol: 0,
};

//TODO Remove later
console.log("Current word is : " + state.secret);

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    console.log(user);
    console.log("The current logged user is " + user.displayName);
  } else {
    // User is signed out
    window.location.assign("./");
  }
});

const keyboard = document.querySelector(".key-container");

keys.forEach((key) => {
  const buttonElement = document.createElement("button");
  buttonElement.textContent = key;
  buttonElement.setAttribute("id", key);
  buttonElement.addEventListener("click", () => handleClick(key));
  keyboard.append(buttonElement);
});

/*Conversie din Upper in Lower, dictionary problem*/
const handleClick = (letter) => {
  var letter = letter.toLowerCase();
  if (letter === "enter") {
    if (state.currentCol === 5) {
      const word = getCurrentWord();
      console.log(word);
      if (isWordValid(word)) {
        revealWord(word);
        state.currentRow++;
        state.currentCol = 0;
      } else {
        alert("Not a valid word. ⛔");
      }
    }
  }
  if (letter === "bksp") {
    removeLetter();
  }
  if (isLetter(letter)) {
    addLetter(letter);
  }
  updateGrid();
};

function drawGrid(container) {
  const grid = document.createElement("div");
  grid.className = "grid";

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
      let square = document.createElement("div");
      square.setAttribute("id", i + 1);
      drawBox(grid, i, j);
    }
  }

  container.appendChild(grid);
}

function updateGrid() {
  for (let i = 0; i < state.grid.length; i++) {
    for (let j = 0; j < state.grid[i].length; j++) {
      const box = document.getElementById(`box${i}${j}`);
      box.textContent = state.grid[i][j];
    }
  }
}

function drawBox(container, row, col, letter = "") {
  const box = document.createElement("div");
  box.className = "box";
  box.textContent = letter;
  box.id = `box${row}${col}`;

  container.appendChild(box);
  return box;
}

/*Conversie din Upper in Lower, dictionary problem*/
function registerKeyboardEvents() {
  document.body.onkeydown = (e) => {
    const key = e.key.toLowerCase();
    if (key === "enter") {
      if (state.currentCol === 5) {
        const word = getCurrentWord();
        if (isWordValid(word)) {
          revealWord(word);
          state.currentRow++;
          state.currentCol = 0;
        } else {
          alert("Not a valid word. ⛔");
        }
      }
    }
    if (key === "backspace") {
      removeLetter();
    }
    if (isLetter(key)) {
      addLetter(key);
    }

    updateGrid();
  };
}

function getCurrentWord() {
  return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

function isWordValid(word) {
  return dictionary.includes(word);
}

function getNumOfOccurrencesInWord(word, letter) {
  let result = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      result++;
    }
  }
  return result;
}

function getPositionOfOccurrence(word, letter, position) {
  let result = 0;
  for (let i = 0; i <= position; i++) {
    if (word[i] === letter) {
      result++;
    }
  }
  return result;
}

//BUG
// const addColorToKey = (keyLetter, color) => {
//   const key = document.getElementById(keyLetter);
//   key.classList.add(color);
// };

function revealWord(guess) {
  const row = state.currentRow;
  const animation_duration = 500; // ms

  for (let i = 0; i < 5; i++) {
    const box = document.getElementById(`box${row}${i}`);
    const letter = box.textContent;
    const numOfOccurrencesSecret = getNumOfOccurrencesInWord(
      state.secret,
      letter
    );
    const numOfOccurrencesGuess = getNumOfOccurrencesInWord(guess, letter);
    const letterPosition = getPositionOfOccurrence(guess, letter, i);

    setTimeout(() => {
      if (
        numOfOccurrencesGuess > numOfOccurrencesSecret &&
        letterPosition > numOfOccurrencesSecret
      ) {
        box.classList.add("empty");
      } else {
        if (letter === state.secret[i]) {
          box.classList.add("right");
          //BUG
          // addColorToKey(letter, "green-overlay");
        } else if (state.secret.includes(letter)) {
          box.classList.add("wrong");
        } else {
          box.classList.add("empty");
        }
      }
    }, ((i + 1) * animation_duration) / 2);

    box.classList.add("animated");
    box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
  }

  const isWinner = state.secret === guess;
  const isGameOver = state.currentRow === 5;

  //Firestore Data x Console Logs
  async function readDoc() {
    const name = auth.currentUser.displayName;
    console.log("Current display Name: " + auth.currentUser.displayName);
    const newattempts = state.currentRow;
    console.log("Current number of attempts: " + state.currentRow);
    const currentUser = doc(database, "users", name);
    clearInterval(timer);
    const timeleft = document.querySelector(".timer").innerHTML;
    console.log("Current timeleft: " + timeleft);
    const mySnapshot = await getDoc(currentUser);
    if (mySnapshot.exists()) {
      // Display data from Firestore Database
      const docData = mySnapshot.data();
      console.log(`My data is ${JSON.stringify(docData)}`);
      const time = mySnapshot.data().time;
      console.log("This is database timeleft: " + time);
      const attempts = mySnapshot.data().attempts;
      console.log("This is database attempts: " + attempts);
      var tc = timeleft > time;
      var ac = newattempts < attempts;
      if (tc || ac) {
        updateDoc(currentUser, {
          time: timeleft,
          attempts: newattempts,
        });
        alert(
          `
          Congratulations! 🎉 This is your new highscore 😎
          
          Time: ${timeleft}   Attempts: ${newattempts} 💯
          
          Your last best was    Time: ${mySnapshot.data().time}   Attempts: ${
            mySnapshot.data().attempts
          } ✔`
        );
      } else {
        alert(
          `
          Well done! 👽 This is not a new record 😢
          
          Your record is    Time: ${mySnapshot.data().time}   Attempts: ${
            mySnapshot.data().attempts
          } ✔`
        );
      }
    } else {
      setDoc(currentUser, {
        time: timeleft,
        attempts: newattempts,
      });
      alert(
        `
          Congratulations! 🎉 This is your new highscore 😎
          
          Time: ${timeleft}   Attempts: ${newattempts} ✔`
      );
    }
  }

  setTimeout(() => {
    if (isWinner) {
      readDoc();
    } else if (isGameOver) {
      alert(`Better luck next time! The word was    ${state.secret}   💥`);
    }
  }, 3 * animation_duration);
}

function isLetter(key) {
  return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter) {
  if (state.currentCol === 5) return;
  state.grid[state.currentRow][state.currentCol] = letter;
  state.currentCol++;
}

function removeLetter() {
  if (state.currentCol === 0) return;
  state.grid[state.currentRow][state.currentCol - 1] = "";
  state.currentCol--;
}

function startup() {
  const game = document.getElementById("game");
  drawGrid(game);
  registerKeyboardEvents();
  initStatsModal();
  if (timer) clearInterval(timer);
  timer = startLogoutTimer();
}

//Timer Test
let timer;
const labelTimer = document.querySelector(".timer");
const startLogoutTimer = function () {
  const tick = function () {
    labelTimer.textContent = `${time}`;

    //When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      signOutAcc();
    }
    //Decrease 1s
    time--;
  };

  // Set time to X mins
  let time = 90;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

const signOutAcc = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      window.location.assign("./");
    })
    .catch((e) => {
      // An error happened.
      console.log(e);
    });
};

//LOGOUT BUTTON + MESSAGE
document.querySelector("#test").onclick = function () {
  if (window.confirm("Do you really want to logout?")) {
    signOutAcc();
  }
};

//RULES
document.querySelector("#rules").onclick = function () {
  alert(`
  Guess the word in 6 attempts 💯

  Correct letters go Green 🟩✔, Incorrect letters go Gray ⬛✖
  
  Correct letters placed in wrong spots would turn Yellow 🟨🤸‍♂️

  Letters can be used more than once. Good luck! ✌`);
};

//MODAL
function initStatsModal() {
  const modal = document.getElementById("stats-modal");
  // Get the button that opens the modal
  const btn = document.getElementById("leaderboard");
  // Get the <span> element that closes the modal
  const span = document.getElementById("close-stats");
  // When the user clicks on the button, open the modal
  btn.addEventListener("click", function () {
    updateStatsModal();
    modal.style.display = "block";
  });
  // When the user clicks on <span> (x), close the modal
  span.addEventListener("click", function () {
    modal.style.display = "none";
  });
  // When the user clicks anywhere outside of the modal, close it
  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}

function updateStatsModal() {
  document.querySelector("#getData").onclick = function () {
    getDatainTable();
  };
}

//LEADERBOARD
async function getDatainTable() {
  const q = query(
    collection(database, "users"),
    orderBy("attempts"),
    orderBy("time", "desc"),
    limit(10)
  );
  const querySnapshot = await getDocs(q);
  for (var i in querySnapshot.docs) {
    const doc = querySnapshot.docs[i];
    // forEach doesn't return index
    // querySnapshot.forEach((doc) => { })
    console.log(doc.id, " => ", doc.data());
    const player =
      `
  <tr>
  <td>` +
      `${i}` +
      `</td>
    <td>` +
      `${doc.id}` +
      `</td>
    <td>` +
      `${doc.data().time}` +
      `</td>
    <td>` +
      `${doc.data().attempts}` +
      `</td>
  </tr>
  `;
    document
      .getElementById("tablebody")
      .insertAdjacentHTML("beforeend", player);
    // document.getElementById("tablebody").innerHTML = player;
  }
}

//TODOFIX Cleanup Crew Raise Up
// return (
//   `
// <tr>
//   <td>` +
//   `${doc.data().displayname}` +
//   `</td>
//   <td>` +
//   `${doc.data().time}` +
//   `</td>
//   <td>` +
//   `${doc.data().attempts}` +
//   `</td>
// </tr>
// `
// );

// let tablebody = document.getElementById("tablebody");
// let tr = document.createElement("tr");
// let th1 = document.createElement("th");
// th1.value = `${doc.data().displayname}`;
// let th2 = document.createElement("th");
// th2.value = `${doc.data().time}`;
// let th3 = document.createElement("th");
// th3.value = `${doc.data().attempts}`;
// tablebody.appendChild(tr);
// tr.appendChild(th1);
// tr.appendChild(th2);
// tr.appendChild(th3);

// var dataSet = new Array();
//   dataSet.push([
//     doc.data().displayname,
//     doc.data().time,
//     doc.data().attempts,
//   ]);
//   $(`#example`).DataTable({
//     data: dataSet,
//     columns: [
//       { title: "Name" },
//       { title: "Time Left" },
//       { title: "Attempts" },
//     ],
//   });

// });

// {
//   let db = firebase.firestore();
//   var dataSet = new Array();
//   var i = 1;

//   db.collection("users")
//     .where("displayname", "==", firebase.auth().currentUser.displayName)
//     .get()
//     .then(function (querySnapshot) {
//       querySnapshot.forEach(function (doc) {
// dataSet.push([
//   doc.data().displayname,
//   doc.data().time,
//   doc.data().attempts,
// ]);
//         i = i + 1;
//       });

//       $("#example").DataTable({
//         data: dataSet,
//         columns: [
//           { title: "Name" },
//           { title: "Time Left" },
//           { title: "Attempts" },
//         ],
//       });
//     });
// }

startup();
