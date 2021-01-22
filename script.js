// DOM elements
const mainCont = document.getElementById('main-container');
const wonGameCont = document.getElementById('won-game-container');
const cssLoader = document.querySelector('.lds-roller');
const microIcon = document.querySelector('.micro-ico');
const msgEl = document.getElementById('message');
const randomWord = document.getElementById('random-word');
const scoreEl = document.getElementById('score');
const difficulty = document.getElementById('difficulty');
const playVoiceBtn = document.getElementById('play-voice');
const speakBtn = document.getElementById('speak-btn');

// Set score
let score = 0;

// Max score by default
let maxScore = 5;

// Arrays of words based on difficulty
const wordsEasy = [
  'hello','see', 'dog','cat','friend','milk','goat','drink', 'fine','sorry','soap','firm','old','age','fire','water', 'elephant', 'tiger', 'whiskey', 'room', 'bubble',
  'sword', 'wheels'
];

const wordsMedium = [
  'timber','preaching', 'freedom','mushroom','grinding','prolonged','intuition','careless', 'custody', 'problematic', 'gross', 'neither', 'antarctic', 'chainmail',
  'horizon', 'cavalry'
];

const wordsHard = [
  'philosophy','procrastination', 'defibrillator','disinterested','gobbledygook','intelligence','werewolf','obscure', 'nonetheless', 'otorhinolaryngologist', 'earthquake', 'anathema'
]

// Sound alerts
const audioGood = new Audio('sound/good.mp3');
const audioBad = new Audio('sound/bad.mp3');
const audioScore = new Audio('sound/score.mp3');


// Speech recognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// Init speech recognition
let recog = new window.SpeechRecognition();

// Speech synthesis
const synth = window.speechSynthesis;
let speech = new SpeechSynthesisUtterance();

// Set default lang to british english
speech.lang = 'en-GB';
recog.lang = 'en-GB';



// Set text 
function setTextMessage() {
  speech.text = randomWord.innerHTML;
}

// Play voice
function playVoice() {
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
  
  if(msg === randomWord.innerHTML) {
    // Play sound if correct answer
    audioGood.play();
    // If correct
    msgEl.innerHTML += 'Correct!';
    msgEl.classList.remove('bad');
    msgEl.classList.add('good');
    calculateScore();
    maxScoreCount();
  } else {
    // Play sound if incorrect answer
    audioBad.play();
    // If not
    msgEl.innerHTML += 'Incorrect! Try again :)';
    msgEl.classList.remove('good');
    msgEl.classList.add('bad');
    setTimeout(() => {
     clearUI();
    }, 2000);
  }

  // Reload speech
  speechReload();
}

// Generate random word
function generateRandom() {
  if(difficulty.value === 'easy') {
    const randomize = wordsEasy[Math.floor(Math.random() * wordsEasy.length)];
    randomWord.innerHTML += randomize; 
    maxScore = 5;

  } else if(difficulty.value === 'medium') {
    const randomize = wordsMedium[Math.floor(Math.random() * wordsMedium.length)];
    randomWord.innerHTML += randomize;
    maxScore = 7;

  } else if(difficulty.value === 'hard') {
    const randomize = wordsHard[Math.floor(Math.random() * wordsHard.length)];
    randomWord.innerHTML += randomize;
    maxScore = 10;
  } 
  scoreEl.innerHTML = `Score: ${score} / ${maxScore}`;
}

// Play again
function playAgain() {
  randomWord.innerHTML = '';
  msgEl.innerHTML = '';
  generateRandom();
}


// Change difficulty based on options
function changeDiff() {
  randomWord.innerHTML = '';
  generateRandom();
}

// Clear UI
function clearUI() {
  randomWord.innerHTML = '';
  msgEl.innerHTML = '';
  generateRandom();
  scoreEl.innerHTML = `Score: ${score = 0} / ${maxScore}`
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
   }, 2000)
}


// Start speech on click and change colors
function startSpeech() {
  microIcon.classList.remove('icon-change-stop');
  microIcon.classList.add('icon-change-start');
  recog.start();
}

// When recognition ends show color
recog.onend = function() {
  microIcon.classList.remove('icon-change-start');
  microIcon.classList.add('icon-change-stop');
}

// Max score count
function maxScoreCount() {
  if(score === maxScore) {
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

// Play again
function playAgainBtn(e) {
if(e.target.id === 'play-again') {
  window.location.reload();
}
}

// Hide elements when score is reached
function hideElements() {
  speakBtn.className = "hide-el";
  playVoiceBtn.className = "hide-el";
  randomWord.className = 'hide-el';
}

// CSS loader overlay
setTimeout(function() {
  mainCont.classList.remove('overlay');
  cssLoader.remove();
}, 3500)

// Generate random word when ready
generateRandom();

// Event listeners
// Play voice 
playVoiceBtn.addEventListener('click', playVoice)

// Change difficulty
difficulty.addEventListener('change', changeDiff);

// Speak button
speakBtn.addEventListener('click', startSpeech);

// Speak result
recog.addEventListener('result', onSpeak);

// Play again button
wonGameCont.addEventListener('click' , playAgainBtn);