const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const wrapper = document.getElementById("container");
canvas.width = wrapper.clientWidth;
canvas.height = wrapper.clientHeight;


let bird, pipes, score, gravity, gameOverFlag, notHelloInfoFlag;
let bestScores = JSON.parse(localStorage.getItem("bestScores")) || [];
const maxBestScores = 5;

const pipeGap = 200;
const pipeDistance = 300; 
const pipeWidth = 80;
const groundHeight = 100; 


const bgImg = new Image();
bgImg.src = "assets/background.png";
bgImg.onload = checkAssetsLoaded;

const birdFrames = [new Image(), new Image(), new Image()];
birdFrames[0].src = "assets/bird1.png";
birdFrames[1].src = "assets/bird2.png";
birdFrames[2].src = "assets/bird3.png";
birdFrames.forEach((img) => (img.onload = checkAssetsLoaded));

const pipeImg = new Image();
pipeImg.src = "assets/pipe.png";
pipeImg.onload = checkAssetsLoaded;

const groundImg = new Image();
groundImg.src = "assets/Flappy Bird/base.png";
groundImg.onload = checkAssetsLoaded;

const dieSound = new Audio("assets/die.ogg");
const pointSound = new Audio("assets/point.ogg");
const swooshSound = new Audio("assets/swoosh.ogg");


const scoreDigits = [];
for (let i = 0; i <= 9; i++) {
    const img = new Image();
    img.src = `assets/UI/Numbers/${i}.png`; // np. 0.png, 1.png ...
    scoreDigits.push(img);
}

function drawScore(score) {
    const scoreStr = score.toString();
    const digitWidth = 30;  // szerokość każdej cyfry
    const digitHeight = 40; // wysokość każdej cyfry
    const startX = canvas.width / 2 - (digitWidth * scoreStr.length) / 2;
    const y = 20; // odległość od góry

    for (let i = 0; i < scoreStr.length; i++) {
        const digit = parseInt(scoreStr[i]);
        ctx.drawImage(scoreDigits[digit], startX + i * digitWidth, y, digitWidth, digitHeight);
    }
}



// --- Inicjalizacja gry ---
function initGame() {
  bird = {
    x: canvas.width / 3,
    y: canvas.height / 3,
    width: 50,
    height: 40,
    dy: 0,
    frame: 0,
    rotation: 0,
  };

  pipes = [];
  score = 0;
  gravity = 0.6;
  gameOverFlag = false;
  drawScore(score);

  spawnPipe();
}

// --- Sterowanie ---
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (!notHelloInfoFlag || gameOverFlag) {
      restartGame();
      notHelloInfoFlag = true;
    } else {
      swooshSound.currentTime = 0;
      swooshSound.play();
      bird.dy = -10;
    }
  }
});

// --- Tworzenie przeszkód ---
function spawnPipe() {
  const minHeight = 50;
  const maxHeight = canvas.height - pipeGap - groundHeight;

  const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
  const bottomY = topHeight + pipeGap;

  let lastPipeX = pipes.length ? pipes[pipes.length - 1].x : canvas.width;
  const newPipeX = lastPipeX + pipeDistance;

  pipes.push({
    x: newPipeX,
    top: topHeight,
    bottom: bottomY,
    width: pipeWidth,
    passed: false,
  });

  setTimeout(spawnPipe, 1500);
}

// --- Rysowanie gry ---
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // tło
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // ptak
  const frame = birdFrames[Math.floor(bird.frame)];
  ctx.save();
  ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
  ctx.rotate(bird.rotation);
  ctx.drawImage(frame, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
  ctx.restore();

  // rury
  pipes.forEach((pipe) => {
    // górna rura
    ctx.save();
    ctx.translate(pipe.x + pipe.width / 2, pipe.top);
    ctx.rotate(Math.PI);
    ctx.drawImage(pipeImg, 0, 0, pipeImg.width, pipe.top, -pipe.width / 2, 0, pipe.width, pipe.top);
    ctx.restore();

    // dolna rura – ograniczona przez ziemię
    const bottomHeight = canvas.height - groundHeight - pipe.bottom;
    ctx.drawImage(pipeImg, 0, 0, pipeImg.width, bottomHeight, pipe.x, pipe.bottom, pipe.width, bottomHeight);
  });

  // ziemia
    ctx.drawImage(groundImg, 0, canvas.height - groundHeight, canvas.width, groundHeight);
    drawScore(score);
}

// --- Aktualizacja gry ---
function update() {
  bird.dy += gravity;
  bird.y += bird.dy;
  bird.rotation = Math.min(Math.PI / 4, bird.dy * 0.05);

  bird.frame += 0.1;
  if (bird.frame >= birdFrames.length) bird.frame = 0;

  pipes.forEach((pipe) => {
    pipe.x -= 4;

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score++;
      pipe.passed = true;
      pointSound.currentTime = 0.1;
      pointSound.play();
    }

    if (
      (bird.x + bird.width > pipe.x &&
        bird.x < pipe.x + pipe.width &&
        (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)) ||
      bird.y + bird.height > canvas.height - groundHeight
    ) {
      gameOverInfo();
    }
  });

  pipes = pipes.filter((pipe) => pipe.x + pipe.width > 0);
}

// --- Game Over ---
function gameOverInfo() {
  gameOverFlag = true;
  dieSound.play();

  bestScores.push(score);
  bestScores.sort((a, b) => b - a);
  bestScores = bestScores.slice(0, maxBestScores);
  localStorage.setItem("bestScores", JSON.stringify(bestScores));
  localStorage.setItem("lastScore", JSON.stringify(score));

  document.getElementById("gameOver").style.display = "block";
  document.getElementById("lastScore").textContent = "Wynik: " + score;
  document.getElementById("bestScores").textContent =
    "Najlepsze wyniki: " + bestScores[0];
}

// --- Restart ---
document.getElementById("restartBtn").addEventListener("click", () => restartGame());

function restartGame() {
  document.getElementById("gameOver").style.display = "none";
  document.getElementById("startGame").style.display = "none";
  notHelloInfoFlag = true;
  initGame();
  requestAnimationFrame(gameLoop);
}

// --- Główna pętla gry ---
function gameLoop() {
  if (!gameOverFlag) {
    document.getElementById("startGame").style.display = "none";
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

// --- Start gry ---
function helloInfo() {
  initGame();
  draw();
  document.getElementById("startGame").style.display = "block";
}

let loaded = 0;
const required = 1 + 1 + birdFrames.length + 1; // +1 dla ground

function checkAssetsLoaded() {
  loaded++;
  if (loaded === required) {
    helloInfo();
  }
}

// function resizeCanvas() {
//     const scale = Math.min(wrapper.clientWidth / 1280, wrapper.clientHeight / 720);
//     canvas.style.width = 1280 * scale + "px";
//     canvas.style.height = 720 * scale + "px";
// }

// window.addEventListener("resize", resizeCanvas);
// resizeCanvas()
