const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- Zmienne gry ---
let bird, pipes, score, gravity, gameOverFlag;
let bestScores = JSON.parse(localStorage.getItem("bestScores")) || [];
const maxBestScores = 5;

const pipeGap = 200; // pionowa przerwa między górną i dolną rurą
const pipeDistance = 300; // minimalna odległość między rurami poziomo
const pipeWidth = 80;

// --- Assety ---
const bgImg = new Image();
bgImg.src = "assets/background.png";

const birdFrames = [
    new Image(), new Image(), new Image()
];
birdFrames[0].src = "assets/bird1.png";
birdFrames[1].src = "assets/bird2.png";
birdFrames[2].src = "assets/bird3.png";

const pipeImg = new Image();
pipeImg.src = "assets/pipe.png";

const dieSound = new Audio("assets/die.ogg");
const pointSound = new Audio("assets/point.ogg");
const swooshSound = new Audio("assets/swoosh.ogg");

// --- Inicjalizacja gry ---
function initGame() {
    bird = {
        x: 300,
        y: canvas.height / 2,
        width: 50,
        height: 40,
        dy: 0,
        frame: 0,
        rotation: 0
    };

    pipes = [];
    score = 0;
    gravity = 0.6;
    gameOverFlag = false;
    document.getElementById("score").textContent = score;

    spawnPipe();
    requestAnimationFrame(gameLoop);
}

// --- Sterowanie ---
document.addEventListener("keydown", e => {
    if(e.code === "Space") {
        swooshSound.currentTime = 0
        swooshSound.play();
        bird.dy = -10; // podbicie ptaka
    }
});

// --- Tworzenie przeszkód ---

function spawnPipe() {
    const minHeight = 50;
    const maxHeight = canvas.height - pipeGap - 50;

    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    const bottomY = topHeight + pipeGap;

    let lastPipeX = pipes.length ? pipes[pipes.length - 1].x : canvas.width;
    const newPipeX = lastPipeX + pipeDistance;

    pipes.push({
        x: newPipeX,
        top: topHeight,
        bottom: bottomY,
        width: pipeWidth,
        passed: false
    });

    // następna rura
    setTimeout(spawnPipe, 1500); // czas tworzenia nowej rury
}

// --- Rysowanie gry ---
function draw() {
    // tło
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    // ptak
    const frame = birdFrames[Math.floor(bird.frame)];
    ctx.save();
    ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
    ctx.rotate(bird.rotation);
    ctx.drawImage(frame, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
    ctx.restore();

    // przeszkody
    pipes.forEach(pipe => {
        ctx.drawImage(pipeImg, pipe.x, 0, pipe.width, pipe.top);
        ctx.drawImage(pipeImg, pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
    });
}

// --- Aktualizacja gry ---
function update() {
    bird.dy += gravity;
    bird.y += bird.dy;
    bird.rotation = Math.min(Math.PI / 4, bird.dy * 0.05);

    bird.frame += 0.1;
    if(bird.frame >= birdFrames.length) bird.frame = 0;

    // przeszkody
    pipes.forEach(pipe => {
        pipe.x -= 4; // przesuwanie rur
        // punktacja
        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score++;
            document.getElementById("score").textContent = score;
            pipe.passed = true;
            pointSound.play();

        }

        // kolizja
        if(
            (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipe.width &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.bottom))
            || bird.y + bird.height > canvas.height
        ){
            gameOver();
        }
    });

    // usuń rury, które wyszły z ekranu
    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

// --- Game Over ---
function gameOver() {
    gameOverFlag = true;
    dieSound.play();

    bestScores.push(score);
    bestScores.sort((a,b)=>b-a);
    bestScores = bestScores.slice(0, maxBestScores);
    localStorage.setItem("bestScores", JSON.stringify(bestScores));

    document.getElementById("gameOver").style.display = "block";
    document.getElementById("lastScore").textContent = "Wynik: " + score;
    document.getElementById("bestScores").textContent = "Najlepsze wyniki: " + bestScores.join(", ");
}

// --- Restart ---
document.getElementById("restartBtn").addEventListener("click", () => {
    document.getElementById("gameOver").style.display = "none";
    initGame();
});

// --- Główna pętla gry ---
function gameLoop() {
    if(!gameOverFlag){
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

// --- Start gry ---
initGame();
