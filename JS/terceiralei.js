const ball1 = document.getElementById("ball1");
const ball2 = document.getElementById("ball2");
const vel1Display = document.getElementById("vel1");
const vel2Display = document.getElementById("vel2");
const mom1Display = document.getElementById("mom1");
const mom2Display = document.getElementById("mom2");
const totalMomentumDisplay = document.getElementById("total-momentum");
const forceArrow1 = document.getElementById("force-arrow1");
const forceArrow2 = document.getElementById("force-arrow2");

const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const applyForceBtn = document.getElementById("apply-force");
const frictionSlider = document.getElementById("friction-slider");
const forceSlider = document.getElementById("force-slider");
const frictionValue = document.getElementById("friction-value");
const forceValue = document.getElementById("force-value");

let pos1, pos2, vel1, vel2, mass1, mass2, friction, appliedForce;
let interval = null;

function resetSimulation() {
    clearInterval(interval);
    pos1 = 20;
    pos2 = 80;
    vel1 = 0;
    vel2 = 0;
    mass1 = 1;
    mass2 = 1;

    frictionSlider.value = 0.1;
    forceSlider.value = 0;
    friction = parseFloat(frictionSlider.value);
    appliedForce = parseFloat(forceSlider.value);

    frictionValue.textContent = friction.toFixed(2);
    forceValue.textContent = appliedForce.toFixed(1);
    forceArrow1.style.opacity = 0;
    forceArrow2.style.opacity = 0;

    updateUI();
}

function updateUI() {
    ball1.style.left = pos1 + "%";
    ball2.style.left = pos2 + "%";

    vel1Display.textContent = vel1.toFixed(2);
    vel2Display.textContent = vel2.toFixed(2);

    mom1Display.textContent = (vel1 * mass1).toFixed(2);
    mom2Display.textContent = (vel2 * mass2).toFixed(2);

    totalMomentumDisplay.textContent = (vel1*mass1 + vel2*mass2).toFixed(2);
}

function showForceArrows() {
    forceArrow1.textContent = vel1 >= 0 ? '→' : '←';
    forceArrow2.textContent = vel2 >= 0 ? '→' : '←';

    forceArrow1.style.left = pos1 + "%";
    forceArrow2.style.left = pos2 + "%";

    forceArrow1.style.opacity = 1;
    forceArrow2.style.opacity = 1;

    setTimeout(() => {
        forceArrow1.style.opacity = 0;
        forceArrow2.style.opacity = 0;
    }, 300);
}

function startSimulation() {
    clearInterval(interval);
    interval = setInterval(() => {
        vel1 *= (1 - friction);
        vel2 *= (1 - friction);
        pos1 += vel1;
        pos2 += vel2;

        if (pos1 + 5 >= pos2) {
            let v1f = ((mass1 - mass2)*vel1 + 2*mass2*vel2)/(mass1 + mass2);
            let v2f = ((mass2 - mass1)*vel2 + 2*mass1*vel1)/(mass1 + mass2);
            vel1 = v1f;
            vel2 = v2f;
            showForceArrows();
        }
        if(pos1 < 0){ pos1 = 0; vel1 *= -1; }
        if(pos1 > 95){ pos1 = 95; vel1 *= -1; }
        if(pos2 < 0){ pos2 = 0; vel2 *= -1; }
        if(pos2 > 95){ pos2 = 95; vel2 *= -1; }

        updateUI();
    }, 50);
}

function applyForce() {
    vel1 += appliedForce;
    vel2 -= appliedForce;

    showForceArrows();
}

startBtn.addEventListener("click", startSimulation);
resetBtn.addEventListener("click", resetSimulation);
applyForceBtn.addEventListener("click", applyForce);

frictionSlider.addEventListener("input", e => {
    friction = parseFloat(e.target.value);
    frictionValue.textContent = friction.toFixed(2);
});

forceSlider.addEventListener("input", e => {
    appliedForce = parseFloat(e.target.value);
    forceValue.textContent = appliedForce.toFixed(1);
});

resetSimulation();
