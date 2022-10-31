# Ignore it

## File made only to keep extra stuff

//Firestore Video
const collectionRef = collection(database, "users");

Submit Data to FireStore
const handleSubmit = () => {
  addDoc(collectionRef, {
    attempts: data.attempts,
    timeleft: data.timeleft,
  })
    .then(() => {
      alert("Data Added");
    })
    .catch((e) => {
      alert(e.message);
    });
};

Read Data - FireStore 
 const getData = () => {
 getDocs(collectionRef).then((response) => {
   console.log(
       response.docs.map((item) => {
        return { ...item.data(), id: item.id };
       })
     );
   });
 };

Update Data - FireStore
const updateData = () => {
  const docToUpdate = doc(
    database,
    "users" 
  );
  updateDoc(docToUpdate, {
    attempts: "",
    timeleft: "",
    /* posibil intr-un IF (timer >= old timer and attempts < old attempts)
    timeleft: this timeleft
    attempts: this attempts
    si sa actualizeze asta doar pentru userul curent
    */
  })
    .then(() => {
      alert("data updated");
    })
    .catch((e) => {
      alert(e.message);
    });
};

Timer
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

<!--Again Button
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
}; -->