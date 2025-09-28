const buttonColors = ["blue", "red", "green", "yellow"];
let gamePattern = [];
let userClickedPattern = [];
let started = false;
let level = 0;
let highScore = localStorage.getItem("simonHighScore") || 0;

const colorMap = {
    blue: "#3498db",
    red: "#e74c3c",
    green: "#2ecc71",
    yellow: "#f1c40f"
};

const header = document.querySelector("header");
const buttons = document.querySelectorAll(".btn");
const highScoreElem = document.getElementById("high-score");
const resetBtn = document.getElementById("reset-score");

function updateHighScore() {
    if (level - 1 > highScore) {
        highScore = level - 1;
        localStorage.setItem("simonHighScore", highScore);
    }
    if (highScoreElem) highScoreElem.textContent = highScore;
}

function nextSequence() {
    userClickedPattern = [];
    level++;
    header.textContent = `Level ${level}`;
    const randomChosenColor = buttonColors[Math.floor(Math.random() * 4)];
    gamePattern.push(randomChosenColor);
    setTimeout(() => animatePress(randomChosenColor), 500);
    playSound(randomChosenColor);
}

function playSound(name) {
    if (name === "wrong") {
        // Error beep
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        o.type = "sawtooth";
        o.frequency.value = 110;
        o.connect(ctx.destination);
        o.start();
        setTimeout(() => {
            o.stop();
            ctx.close();
        }, 250);
        return;
    }
    // Simple beep for feedback
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = {
        blue: 261.6,
        red: 329.6,
        green: 392.0,
        yellow: 523.3
    }[name];
    o.connect(ctx.destination);
    o.start();
    setTimeout(() => {
        o.stop();
        ctx.close();
    }, 150);
}

function animatePress(color) {
    const btn = document.getElementById(color);
    btn.classList.add("pressed");
    setTimeout(() => btn.classList.remove("pressed"), 200);
}

function animateWrong(color) {
    const btn = document.getElementById(color);
    if (!btn) return;
    btn.classList.add("wrong");
    setTimeout(() => btn.classList.remove("wrong"), 400);
}

function checkAnswer(currentLevel) {
    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(nextSequence, 1000);
        }
    } else {
        playSound("wrong");
        animateWrong(userClickedPattern[currentLevel]);
        document.body.classList.add("game-over");
        header.textContent = "Wrong! Game Over, Press Any Key to Restart";
        updateHighScore();
        setTimeout(() => document.body.classList.remove("game-over"), 400);
        startOver();
    }
}

function startOver() {
    level = 0;
    gamePattern = [];
    started = false;
}

buttons.forEach(btn => {
    btn.addEventListener("click", function () {
        if (!started) return;
        const userChosenColor = this.id;
        userClickedPattern.push(userChosenColor);
        playSound(userChosenColor);
        animatePress(userChosenColor);
        checkAnswer(userClickedPattern.length - 1);
    });
});

document.addEventListener("keydown", function () {
    if (!started) {
        header.textContent = "Level 0";
        nextSequence();
        started = true;
    }
});

if (resetBtn) {
    resetBtn.addEventListener("click", function () {
        highScore = 0;
        localStorage.setItem("simonHighScore", 0);
        if (highScoreElem) highScoreElem.textContent = 0;
    });
}

// Initialize high score display on load
if (highScoreElem) highScoreElem.textContent = highScore;
