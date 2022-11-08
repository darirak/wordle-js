<h1 align="center">Wordle Clone with Vanilla JavaScript</h1>

  <p align="center">
    <a href="https://wordle-js-angi.vercel.app"><strong>:point_right: Live Demo on Vercel :point_left:</strong></a>
    <br />
    <br />
  </p>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#intro">Intro</a>
      <ul>
        <li><a href="#rules">Rules</a></li>
      </ul>
    </li>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-using">Built Using</a></li>
      </ul>
    </li>
    <li><a href="#contact-me">Contact</a></li>
  </ol>
</details>

<!-- Intro -->
## Intro



https://user-images.githubusercontent.com/43470248/200020033-b181dd75-ff8a-4fd2-bbdc-f3bc84bdf1d2.mp4



### Rules
&emsp; Guess the Wordle (a 5-letter word) in 6 tries.
<br /> &emsp; The color of the tiles will change to show how close your guess was to the word.
* ![#538D4E](https://via.placeholder.com/15/538D4E/538D4E.png) Green - The word contains that letter & the letter is in the correct spot
* ![#B59F3B](https://via.placeholder.com/15/B59F3B/B59F3B.png) Yellow - The word contains that letter but the letter is in the wrong spot
* ![#3A3A3C](https://via.placeholder.com/15/3A3A3C/3A3A3C.png) Gray - The word doesn't include that letter

### Login Account:
  - You can also create your own account
  - Email = `aaaaaa@yahoo.com`
  - Password = `aaaaaa`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ABOUT THE PROJECT -->
## About The Project

<!-- FLOWCHART -->

### **Flowchart of the Project**
* ![#dfc686](https://via.placeholder.com/15/dfc686/dfc686.png) Yellow - The possible actions a user can take
* ![#94bb80](https://via.placeholder.com/15/94bb80/94bb80.png) Green - Shows what happens as soon as one action is executed
* ![#8ba6ce](https://via.placeholder.com/15/8ba6ce/8ba6ce.png) Blue - `If-Else` where we check for a certain condition
* ![#c58280](https://via.placeholder.com/15/c58280/c58280.png) Red - Finish Line :)

### Summary

* **Wordle is a game where you have to guess a 5-letter word in 6 goes or less.**
  * Features of the project:
    * Responsive Design
    * Fully Functional Game - Give it a try :)
    * Firebase Authentication (Login/Signup Pages)
    * Firestore for Data Handling (Highscore Stats)
    * Leaderboard (based on Firestore)
    * Version Control (different branches for each major change)
    * Patch Notes with link to each branch (<a href="#patch-notes">down below</a>)

### Built Using

* [![HTML][HTML.com]][HTML-url]
* [![CSS][CSS3.com]][CSS-url]
* [![JavaScript][JavaScript.com]][JavaScript-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[HTML.com]: https://img.shields.io/badge/html-e44d26?style=for-the-badge&logo=html5&logoColor=white
[HTML-url]: https://www.html.com/
[CSS3.com]: https://img.shields.io/badge/css-0070ba?style=for-the-badge&logo=css3&logoColor=white
[CSS-url]: https://www.css3.com/
[JavaScript.com]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[JavaScript-url]: https://www.javascript.com/

### Patch Notes:

<a href="https://github.com/darirak/wordle-js/tree/Version-4">v4.1</a> - Firestore Database + Leaderboard Ranks

- [4.1] Changed Project Structure - CSS and JS in separate folders
- Firestore Database - Player-Data Available in Firestore (Display Name, Attempts and Time Left)
- Leaderboard - Displays #Top10 Best Players (Sorted via Composite Indexed Fields - Attempts ascending & Time descending)
- Functional SignUp + Page Changes - CSS & "Display Name" Field added
- Customized Alerts for Winning / Losing
- Modal for Leaderboard
- Functional Buttons

<a href="https://github.com/darirak/wordle-js/tree/Version-3">v3.1</a> - Firebase Authentication

- [3.1] SignUp Page - Email-Password
- Login Page - Email-Password & Google Sign-In
- Firebase Auth - User is logged on session, gets kicked if the timer expires
- CSS: Login Page CSS, New Icons added for Wordle Page
- Buttons for Log-Out, Timer, Rules, Restart Game and Leaderboard (work in progress)
- File Structure Changes (Wordle Game moved to new files)

<a href="https://github.com/darirak/wordle-js/tree/Version-2">v2.0</a> - On-Screen Mobile Keyboard

- Functional On-Screen Keyboard
- CSS: Default Keyboard
- Fixed Capitalization Input Errors

<a href="https://github.com/darirak/wordle-js/tree/Version-1">v1.0</a> - Game Implementation (without on-screen mobile keyboard)

- Functional Game
- Alerts for Invalid Word/Win/Lose
- CSS & Animation: Normal-Wrong-Right letter display, Letter flipping
- Over 5000 Words - credits to [charlesreid1](https://github.com/charlesreid1/five-letter-words/blob/master/sgb-words.txt)

<p align="right">Replica of <a href="https://www.nytimes.com/games/wordle/index.html">original Wordle Game</a>
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact Me

<p>
<div align="center">
  <a href="https://darirak.ro/"><img src="https://img.shields.io/badge/-My%20Portfolio%20Website-blueviolet?style=for-the-badge" alt="Alcaan Design - My Portfolio Website" /></a>
  <a href="https://www.linkedin.com/in/darirak/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
</div>
