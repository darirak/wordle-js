import { testDictionary, realDictionary } from "./dictionary.js";
import { app, database } from "./firebase.js";
import { keys } from "./keys.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";
import {
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

const auth = getAuth(app);
const dictionary = realDictionary;
const keyboard = document.querySelector(".key-container");
const state = {
  secret: dictionary[Math.floor(Math.random() * dictionary.length)],
  grid: Array(6)
    .fill()
    .map(() => Array(5).fill("")),
  currentRow: 0,
  currentCol: 0,
};
console.log("Current word is : " + state.secret);

onAuthStateChanged(auth, function (user) {
  if (user) {
    console.log(user);
    console.log("The current logged user is " + user.displayName);
  } else {
    // User is signed out
    window.location.assign("./");
  }
});

keys.forEach(function (key) {
  const buttonElement = document.createElement("button");
  buttonElement.textContent = key;
  var key = key.toLowerCase();
  buttonElement.setAttribute("id", key);
  buttonElement.addEventListener("click", () => handleClick(key));
  keyboard.append(buttonElement);
});

function handleClick(letter) {
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
}

function registerKeyboardEvents() {
  document.body.onkeydown = function (e) {
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

    setTimeout(function () {
      const keys = document.getElementById(letter);
      if (
        numOfOccurrencesGuess > numOfOccurrencesSecret &&
        letterPosition > numOfOccurrencesSecret
      ) {
        box.classList.add("empty");
        keys.classList.add("empty");
      } else {
        if (letter === state.secret[i]) {
          box.classList.add("right");
          keys.classList.add("right");
        } else if (state.secret.includes(letter)) {
          box.classList.add("wrong");
          keys.classList.add("wrong");
        } else {
          box.classList.add("empty");
          keys.classList.add("empty");
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
    const newattempts = state.currentRow;
    const currentUser = doc(database, "users", name);
    clearInterval(timer);
    const timeleft = document.querySelector(".timer").innerHTML;
    console.log(
      "\n Current Player \n \n" +
        "Display Name: " +
        auth.currentUser.displayName +
        "\n" +
        "Remaining Time: " +
        timeleft +
        "\n" +
        "Number of Attempts: " +
        state.currentRow
    );
    const mySnapshot = await getDoc(currentUser);
    if (mySnapshot.exists()) {
      // Display Data from Firestore Database
      const docData = mySnapshot.data();
      const time = mySnapshot.data().time;
      const attempts = mySnapshot.data().attempts;
      console.log(
        "\n Personal Database Record \n \n" +
          "Timeleft: " +
          time +
          "\n" +
          "Attempts: " +
          attempts
      );
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

  setTimeout(function () {
    if (isWinner) {
      stopKeyboard();
      readDoc();
    } else if (isGameOver) {
      stopKeyboard();
      alert(`Better luck next time! The word was    ${state.secret}   💥`);
    }
  }, 3 * animation_duration);
}

function stopKeyboard() {
  //Keyboard
  document.body.onkeydown = null;
  //On-Screen Keyboard
  let keyboards = document.querySelector(".key-container");
  let clone = keyboards.cloneNode(true);
  keyboards.parentNode.insertBefore(clone, keyboards);
  keyboards.parentNode.removeChild(keyboards);
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

//TIMER
let timer;
const labelTimer = document.querySelector(".timer");
function startLogoutTimer() {
  function tick() {
    labelTimer.textContent = `${time}`;

    //When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      signOutAcc();
    }
    //Decrease 1s
    time--;
  }
  // Set time to X seconds
  let time = 90;
  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}

function signOutAcc() {
  signOut(auth)
    .then(function () {
      // Sign-out successful.
      window.location.assign("./");
    })
    .catch(function (e) {
      // An error happened.
      console.log(e);
    });
}

//LOGOUT BUTTON + MESSAGE
document.querySelector("#logout").onclick = function () {
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
    modal.style.display = "block";
    leaderboard();
    leaderboard = function () {
      let ldb = document.getElementById("tablebody");
      let cloned = ldb.cloneNode(true);
      ldb.parentNode.insertBefore(cloned, ldb);
      ldb.parentNode.removeChild(ldb);
    };
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

//LEADERBOARD
var leaderboard = async function getDatainTable() {
  const q = query(
    collection(database, "users"),
    orderBy("attempts"),
    orderBy("time", "desc"),
    limit(10)
  );
  const querySnapshot = await getDocs(q);
  // forEach doesn't return index | querySnapshot.forEach(function(doc) { })
  for (var i in querySnapshot.docs) {
    const doc = querySnapshot.docs[i];
    let index = i;
    index++;
    const player =
      `
  <tr>
  <td id="index">` +
      `${index}` +
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
};

// DISABLE SCROLL
function noScroll() {
  document.body.style.overflow = "hidden";
  document.body.style.userSelect = "none";
}

function startup() {
  const game = document.getElementById("game");
  drawGrid(game);
  noScroll();
  registerKeyboardEvents();
  initStatsModal();
  if (timer) clearInterval(timer);
  timer = startLogoutTimer();
}

startup();
