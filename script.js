// DOM elements
const mainCont = document.getElementById("main-container");
const wonGameCont = document.getElementById("won-game-container");
const cssLoader = document.querySelector(".lds-roller");
const microIcon = document.querySelector(".micro-ico");
const msgEl = document.getElementById("message");
const randomWord = document.getElementById("random-word");
const scoreEl = document.getElementById("score");
let timeEl = document.getElementById("time");
const difficulty = document.getElementById("difficulty");
const playVoiceBtn = document.getElementById("play-voice");
const speakBtn = document.getElementById("speak-btn");
const randomizeBtn = document.getElementById("randomize-words");
const timerBtn = document.getElementById("diff-timer");

// Set score
let score = 0;

// Difficulty by default
difficulty.value === "easy";

// Set time
let timeInSeconds = 10;

// Set HTML score
function setElScore() {
  scoreEl.innerHTML = `Score: ${score} / ${maxScore}`;
}

// Reset score when difficulty change
function resetScore() {
  score = 0;
  setElScore();
}

// Arrays of words based on difficulty
const wordsEasy = [
  "hello",
  "see",
  "dog",
  "cat",
  "friend",
  "milk",
  "good",
  "drink",
  "fine",
  "sorry",
  "soap",
  "phone",
  "old",
  "age",
  "fire",
  "water",
  "elephant",
  "tiger",
  "whiskey",
  "room",
  "bubble",
  "sword",
  "wheels",
];

const wordsMedium = [
  "timber",
  "preaching",
  "freedom",
  "mushroom",
  "grinding",
  "prolonged",
  "intuition",
  "careless",
  "custody",
  "problematic",
  "gross",
  "neither",
  "grooming",
  "chainmail",
  "microscope",
  "cavalry",
];

const wordsHard = [
  "philosophy",
  "procrastination",
  "defibrillator",
  "disinterested",
  "gobbledygook",
  "intelligence",
  "werewolf",
  "obscure",
  "nonetheless",
  "otorhinolaryngologist",
  "earthquake",
  "anathema",
];

// Clear random word
function clearRandom() {
  randomWord.innerHTML = "";
}

// Sound alerts
const audioGood = new Audio("sound/good.mp3");
const audioBad = new Audio("sound/bad.mp3");
const audioScore = new Audio("sound/score.mp3");
const audioClock = new Audio("sound/clock.mp3");

// Speech recognition
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

// Init speech recognition
let recog = new window.SpeechRecognition();

// Speech synthesis
const synth = window.speechSynthesis;
let speech = new SpeechSynthesisUtterance();

// Set default lang to british english
speech.lang = "en-GB";
recog.lang = "en-GB";

// Set text
function setTextMessage() {
  speech.text = randomWord.innerHTML;
}

// Play voice
function playVoice() {
  // Stop recognition while voice playing to avoid score cheating
  recog.stop();
  setTextMessage();

  // Speak voice
  synth.speak(speech);
}

// Capture users words
function onSpeak(e) {
  const msg = e.results[0][0].transcript;

  displayWord(msg);
  checkWord(msg);
}

// Write what user said
function displayWord(msg) {
  msgEl.innerHTML = `
    <div>You said: </div>
    <span class="box">${msg.toLowerCase()}</span>`;
}

// Check word
function checkWord(msg) {
  if (msg === randomWord.innerHTML) {
    // Play sound if correct answer
    audioGood.play();
    // If correct
    msgEl.innerHTML += "Correct!";
    msgEl.classList.remove("bad");
    msgEl.classList.add("good");
    calculateScore();
    maxScoreCount();
  } else {
    // Play sound if incorrect answer
    audioBad.play();
    // If not
    msgEl.innerHTML += "Incorrect! Try again =)";
    msgEl.classList.remove("good");
    msgEl.classList.add("bad");
    setTimeout(() => {
      clearUI();
    }, 2000);
  }

  // Reload speech
  speechReload();
}

// Generate random word
function generateRandom() {
  if (difficulty.value === "easy") {
    const randomize = wordsEasy[Math.floor(Math.random() * wordsEasy.length)];
    randomWord.innerHTML += randomize;
    maxScore = 5;
  } else if (difficulty.value === "medium") {
    const randomize =
      wordsMedium[Math.floor(Math.random() * wordsMedium.length)];
    randomWord.innerHTML += randomize;
    maxScore = 7;
  } else if (difficulty.value === "hard") {
    const randomize = wordsHard[Math.floor(Math.random() * wordsHard.length)];
    randomWord.innerHTML += randomize;
    maxScore = 10;
  }
  setElScore();
}

// Timer on
function timerOn() {
  timerBtn.classList.add("non-clickable");
  const timeInter = setInterval(() => {
    timeInSeconds--;
    timeEl.innerHTML = `Time left: ${timeInSeconds}`;

    if (timeInSeconds <= 3) {
      audioClock.play();
    }

    if (timeInSeconds <= 0) {
      audioClock.pause();
      clearInterval(timeInter);
      timeEl.innerHTML = "Time out! Try again =)";
      setTimeout(() => {
        timeEl.innerHTML = "Time left: 0";
      }, 2000);
      timeInSeconds = 11;
      // Reset score when time runs out
      resetScore();
      timerBtn.classList.remove("non-clickable");
    }
  }, 1000);
}

// Play again
function playAgain() {
  clearRandom();
  msgEl.innerHTML = "";
  generateRandom();
}

// Change difficulty based on options
function changeDiff() {
  clearRandom();
  generateRandom();
}

// Clear UI
function clearUI() {
  clearRandom();
  msgEl.innerHTML = "";
  generateRandom();
  scoreEl.innerHTML = `Score: ${(score = 0)} / ${maxScore}`;
}

// Calculate score
function calculateScore() {
  scoreEl.innerHTML = `Score: ${score + 1} / ${maxScore}`;
  score++;
}

// Reload speech synth
function speechReload() {
  setTimeout(() => {
    playAgain();
  }, 2000);
}

// Start speech on click and change colors
function startSpeech() {
  microIcon.classList.remove("icon-change-stop");
  microIcon.classList.add("icon-change-start");
  recog.start();
}

// When recognition ends show color
recog.onend = function () {
  microIcon.classList.remove("icon-change-start");
  microIcon.classList.add("icon-change-stop");
};

// Max score count
function maxScoreCount() {
  if (score === maxScore) {
    wonGameCont.innerHTML += `
    <div class="won-game" id="won-game">
      <h3>Congratulations you won, your score is <span class="score-highlight"> ${score} / ${maxScore}</span></h3>
      <button class="play-again" id="play-again">Play again</button>
    </div>`;
    hideElements();
    audioScore.play();
    difficulty.disabled = true;
  }
}

// Randomize words
function randomizeWords() {
  clearRandom();
  generateRandom();
}

// Play again
function playAgainBtn(e) {
  if (e.target.id === "play-again") {
    window.location.reload();
  }
}

// Hide elements when score is reached
function hideElements() {
  speakBtn.className = "hide-el";
  playVoiceBtn.className = "hide-el";
  randomWord.className = "hide-el";
  randomizeBtn.className = "hide-el";
  timerBtn.className = "hide-el";
}

// Hide elements while loading
document.querySelector("body").classList.add("non-clickable");

// CSS loader overlay
setTimeout(function () {
  mainCont.classList.remove("overlay");
  // Show elements when loaded
  document.querySelector("body").classList.remove("non-clickable");
  cssLoader.remove();
}, 3500);

// Generate random word when ready
generateRandom();

// Event listeners
// Play voice
playVoiceBtn.addEventListener("click", playVoice);

// Change difficulty
difficulty.addEventListener("change", changeDiff);

// Reset score when difficulty changed
difficulty.addEventListener("change", resetScore);

// Speak button
speakBtn.addEventListener("click", startSpeech);

// Speak result
recog.addEventListener("result", onSpeak);

// Play again button
wonGameCont.addEventListener("click", playAgainBtn);

// Randomize words
randomizeBtn.addEventListener("click", randomizeWords);

// Turn on timer
timerBtn.addEventListener("click", timerOn);
