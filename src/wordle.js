import { testDictionary, realDictionary } from "./dictionary.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";
import app from "../firebase.js";

console.log("test dictionary:", testDictionary);

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

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    console.log(user);
    console.log("The current logged user is " + user.displayName);
    // ...
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

  setTimeout(() => {
    if (isWinner) {
      //TODO Register Timer once you win for leaderboard
      clearInterval(timer);
      alert("Congratulations! 🎉");
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
  if (timer) clearInterval(timer);
  timer = startLogoutTimer();
}

//Timer Test
let timer;
const labelTimer = document.querySelector(".timer");
const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //Print remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    //When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      signOutAcc();
    }

    //Decrease 1s
    time--;
  };

  // Set time to X mins
  let time = 120;

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

// BUG : Again Button
document.getElementById("again").onclick = function () {
  //Clear Timer
  if (timer) clearInterval(timer);
  timer = startLogoutTimer();
  //Reset Grid
  //Reset KeyBoard Color

  //Get New Word TODO replace current word with new word
  secret = dictionary[Math.floor(Math.random() * dictionary.length)];
  console.log(secret);
  /* document.querySelector(state).value = ""; */
  //Clear any on-screen effects (grid related, win / lose)
};

startup();
