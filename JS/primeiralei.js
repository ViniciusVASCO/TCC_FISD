const ball = document.getElementById("ball");
const velocityDisplay = document.getElementById("velocity-display");
const positionDisplay = document.getElementById("position-display");
const frictionSlider = document.getElementById("friction-slider");
const forceSlider = document.getElementById("force-slider");
const frictionValue = document.getElementById("friction-value");
const forceValue = document.getElementById("force-value");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const applyForceBtn = document.getElementById("apply-force-btn");
const resetBtn = document.getElementById("reset-btn");
const forceIndicator = document.getElementById("force-indicator");

let ballPosition = 50;
let velocity = 0;
let friction = 0.1;
let force = 0;
let isRunning = false;
let showForce = false;
let interval = null;

function updateUI() {
    ball.style.left = `${ballPosition}%`;
    velocityDisplay.textContent = `${velocity.toFixed(2)} m/s`;
    positionDisplay.textContent = `${ballPosition.toFixed(1)}%`;
}

function startSimulation() {
    if (isRunning) return;
    isRunning = true;

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    applyForceBtn.disabled = false;
    ball.classList.add("active");

    if (velocity === 0) velocity = 2;

    interval = setInterval(() => {

        if (force === 0 && friction === 0) {
            ballPosition += velocity;

            if (ballPosition >= 100 || ballPosition <= 0) {
                ball.style.display = "none";
                pauseSimulation();
                return;
            }

            updateUI();
            return;
        }

        if (showForce) velocity += force * 0.1;

        velocity *= (1 - friction);

        ballPosition += velocity;

        if (ballPosition <= 5) {
            ballPosition = 5;
            velocity = -velocity * 0.8;
        } else if (ballPosition >= 95) {
            ballPosition = 95;
            velocity = -velocity * 0.8;
        }

        if (showForce) {
            forceIndicator.style.left = `${ballPosition}%`;
        }
        updateUI();

    }, 50);
}

function pauseSimulation() {
    isRunning = false;
    clearInterval(interval);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    applyForceBtn.disabled = true;
    ball.classList.remove("active");
}

function resetSimulation() {
    pauseSimulation();
    ballPosition = 50;
    velocity = 0;
    ball.style.display = "block";
    updateUI();
}

function applyForce() {
    if (!isRunning) return;
    showForce = true;
    forceIndicator.classList.remove("hidden");
    forceIndicator.style.left = `${ballPosition}%`;

    setTimeout(() => {
        showForce = false;
        forceIndicator.classList.add("hidden");
    }, 1000);
}

startBtn.addEventListener("click", startSimulation);
pauseBtn.addEventListener("click", pauseSimulation);
resetBtn.addEventListener("click", resetSimulation);
applyForceBtn.addEventListener("click", applyForce);

frictionSlider.addEventListener("input", (e) => {
    friction = parseFloat(e.target.value);
    frictionValue.textContent = friction.toFixed(2);
});

forceSlider.addEventListener("input", (e) => {
    force = parseFloat(e.target.value);
    forceValue.textContent = force.toFixed(1);
});

updateUI();
