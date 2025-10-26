const gameArea = document.getElementById('game-area');
const player = document.getElementById('player');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const gameOverScreen = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');

let score = 0;
let lives = 3;
let objects = [];
let gameInterval;
let objectInterval;

const fruits = [
  'images/apple.png',
  'images/banana.png',
  'images/grape.png',
  'images/orange.png',

];

// Move player with mouse
document.addEventListener('mousemove', e => {
  const rect = gameArea.getBoundingClientRect();
  let x = e.clientX - rect.left - player.offsetWidth / 2;
  if (x < 0) x = 0;
  if (x > rect.width - player.offsetWidth) x = rect.width - player.offsetWidth;
  player.style.left = x + 'px';
});

// Move player with touch
document.addEventListener('touchmove', e => {
  const touch = e.touches[0];
  const rect = gameArea.getBoundingClientRect();
  let x = touch.clientX - rect.left - player.offsetWidth / 2;
  if (x < 0) x = 0;
  if (x > rect.width - player.offsetWidth) x = rect.width - player.offsetWidth;
  player.style.left = x + 'px';
});

// Create a falling fruit
function createObject() {
  const obj = document.createElement('div');
  obj.classList.add('falling-object');
  obj.style.left = Math.random() * (gameArea.offsetWidth - 40) + 'px';
  obj.style.top = '0px';

  // Randomly pick a fruit
  const fruitSrc = fruits[Math.floor(Math.random() * fruits.length)];
  obj.style.backgroundImage = `url(${fruitSrc})`;

  // Increase size only for grape
  if (fruitSrc.includes('grape.png')) {
    obj.style.width = '70px';   // increase width
    obj.style.height = '70px';  // increase height
  } else {
    obj.style.width = '40px';   // normal size for others
    obj.style.height = '40px';
  }

  gameArea.appendChild(obj);
  objects.push(obj);
}


// Update falling objects
function updateObjects() {
  for (let i = objects.length - 1; i >= 0; i--) {
    const obj = objects[i];
    obj.style.top = obj.offsetTop + 5 + 'px';

    // Collision detection
    if (
      obj.offsetTop + obj.offsetHeight >= player.offsetTop &&
      obj.offsetLeft + obj.offsetWidth > player.offsetLeft &&
      obj.offsetLeft < player.offsetLeft + player.offsetWidth
    ) {
      score++;
      scoreEl.textContent = `Score: ${score}`;
      gameArea.removeChild(obj);
      objects.splice(i, 1);
    }

    // Missed fruit
    else if (obj.offsetTop > gameArea.offsetHeight) {
      lives--;
      livesEl.textContent = `Lives: ${lives}`;
      gameArea.removeChild(obj);
      objects.splice(i, 1);

      if (lives <= 0) gameOver();
    }
  }
}

// Game loop
function gameLoop() {
  updateObjects();
}

// Start game
function startGame() {
  score = 0;
  lives = 3;
  scoreEl.textContent = `Score: ${score}`;
  livesEl.textContent = `Lives: ${lives}`;
  objects.forEach(obj => gameArea.removeChild(obj));
  objects = [];
  gameOverScreen.classList.remove('show');
  clearInterval(objectInterval);
  clearInterval(gameInterval);
  objectInterval = setInterval(createObject, 1000);
  gameInterval = setInterval(gameLoop, 30);
}

// Game over
function gameOver() {
  clearInterval(objectInterval);
  clearInterval(gameInterval);
  finalScore.textContent = score;
  gameOverScreen.classList.add('show');

  // Attach listener after modal appears
  const restartBtn = document.getElementById('restart-btn');
  restartBtn.onclick = () => {
    startGame();
  };
}

// Start automatically
startGame();
