const msgEl = document.getElementById('message');
const randomWord = document.getElementById('random-word');
const scoreEl = document.getElementById('score');
const difficulty = document.getElementById('difficulty');
const playVoiceBtn = document.getElementById('play-voice');

// Set score
let score = 0;

// Arrays of words based on difficulty
const wordsEasy = [
  'hello','see', 'dog','cat','friend','milk','goat','drink', 'fine','sorry','soap','grim','old','age','fire','water'
];

const wordsMedium = [
  'timber','preaching', 'freedom','mushroom','grinding','prolonged','intuition','careless', 'custody', 'problematic', 'gross'
];

const wordsHard = [
  'philosophy','procrastination', 'literally','disinterested','gobbledegook','intelligence','werewolf','obscure', 'nonetheless'
]


// Speech recognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// Init speech recognition
let recog = new window.SpeechRecognition();

// Speech synthesis
const synth = window.speechSynthesis;
let speech = new SpeechSynthesisUtterance();

// Set default lang to british english
speech.lang = 'en-UK';


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

// Start recognition
recog.continuous = true;
recog.start();

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
    <span class="box">${msg}</span>`
}



// Check word
function checkWord(msg) {
  if(msg === randomWord.innerHTML) {
    // If correct
    msgEl.innerHTML += 'Correct!';
    msgEl.classList.remove('bad');
    msgEl.classList.add('good');
    calculateScore();
  } else {
    // If not
    msgEl.innerHTML += 'Incorrect! Try again :)';
    msgEl.classList.remove('good');
    msgEl.classList.add('bad');
    setTimeout(() => {
     clearUI();
     score = 0;
    }, 2000);
  }
  recog.stop();
  speechReload();
}

// Generate random word
function generateRandom() {
  if(difficulty.value === 'easy') {
    const randomize = wordsEasy[Math.floor(Math.random() * wordsEasy.length)];
    randomWord.innerHTML += randomize; 

  } else if(difficulty.value === 'medium') {
    const randomize = wordsMedium[Math.floor(Math.random() * wordsMedium.length)];
    randomWord.innerHTML += randomize;

  } else if(difficulty.value === 'hard') {
    const randomize = wordsHard[Math.floor(Math.random() * wordsHard.length)];
    randomWord.innerHTML += randomize;
  } 
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
  scoreEl.innerHTML = `Score: ${score = 0}`
}

// Calculate score
function calculateScore() {
  scoreEl.innerHTML = `Score: ${score + 1}`;
  score++;
}

// Reload speech synth 
function speechReload() {
  setTimeout(() => {

    recog.start();
     playAgain();
   }, 2000)
}

function reloadOnEnd() {
  setTimeout(() => {
    recog.start();
   }, 50)
}


// Play voice 
playVoiceBtn.addEventListener('click', playVoice)

// Change difficulty
difficulty.addEventListener('change', changeDiff);


// Speak result
recog.addEventListener('result', onSpeak);

// Recognition stops event
recog.addEventListener('onend', reloadOnEnd);

// Generate random word when ready
generateRandom();
