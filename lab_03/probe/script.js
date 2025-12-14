var canvas = document.getElementById("main");
var c = canvas.getContext('2d');
let buttons = [];

function init() {
  // initialization
  let startGame = new Button('Start Game', '#eeaa00', '#001122');
  startGame.setPosition(canvas.width / 2 - 100, 150);
  startGame.setSize(200, 75);
  buttons.push(startGame);
}

canvas.addEventListener('click', (event: MouseEvent) => {
  let x = event.pageX - (canvas.clientLeft + canvas.offsetLeft);
  let y = event.pageY - (canvas.clientTop + canvas.offsetTop);
  
  buttons.forEach(b => {
    if (b.inBounds(x, y) && !!b.onClick) b.onClick();
  });
});

function update() {
    c.fillStyle = "#000000";
    c.fillRect(0, 0, canvas.width, canvas.height);
    // game loop
    c.fillStyle = "#eeaa00";
    c.fillRect(220, 100, 200, 75);
    c.fillStyle = "#001122";
    c.textAlign = "center";
    c.font = "25px arial";
    c.fillText("Start Game", 320, 145, 200);
    buttons.forEach(button => button.draw(c));
    requestAnimationFrame(update);
}
init();