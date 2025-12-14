let startTime = 0;
let startPointTime = 0;
let elapsedMemTime = 0;
let interval = null;
let btnStart = document.getElementById("btn-start");
let btnStop = document.getElementById("btn-stop");
let btnReset = document.getElementById("btn-reset");
let display = document.getElementById("display");
const DEFAULT_DISPLAY_VALUE = "0s"

display.value = DEFAULT_DISPLAY_VALUE
btnStart.addEventListener('click', () => {
    startPointTime = performance.now();
    interval = setInterval(update, 100);
})

btnStop.addEventListener('click', () => {
    const nowTime = performance.now();
    elapsedMemTime = elapsedMemTime + nowTime - startPointTime;
    startPointTime = nowTime;
    clearInterval(interval);
})

btnReset.addEventListener('click', () => {
    clearInterval(interval);
    elapsedMemTime = 0;
    display.value = DEFAULT_DISPLAY_VALUE;
})
 

function update() {
    const elapsed = elapsedMemTime + performance.now() - startPointTime;
    const sec = Math.floor((elapsed / 1000) % 60);
    const min = Math.floor((elapsed / 1000 / 60) % 60);

    const secRepr = String(sec) + "s"; 
    const minRepr = min == 0 ? "": String(min) + "min"
    display.value = secRepr + " " + minRepr;
}
