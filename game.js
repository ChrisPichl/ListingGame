const frames = ['./assests/1.png', './assests/2.png', './assests/3.png', './assests/4.png', './assests/5.png', './assests/6.png'];
const startSound = new Audio('./assests/game.mp3');
const frame3Sound = new Audio('./assests/in.mp3');
const frame5Sound = new Audio('./assests/out.mp3');

frame3Sound.playbackRate = 3.0;
frame5Sound.playbackRate = 1.5;

const animationFrame = document.getElementById('animation-frame');
const randomButton1 = document.getElementById('random-button1');
const randomButton2 = document.getElementById('random-button2');
const scoreDisplay = document.getElementById('score-display');
const menuScreen = document.getElementById('menu-screen');
const gameContainer = document.querySelector('.game-container');
const gameOverScreen = document.getElementById('game-over-screen');
const highscoresScreen = document.getElementById('highscores-screen');
const highscoresList = document.getElementById('highscores-list');

let activeButton = null;
let isAnimating = false;
let score = 0;

function assignButtonColors() {
    if (isAnimating) return;
    const randomChoice = Math.random();
    if (randomChoice > 0.33) {
        randomButton1.style.backgroundColor = 'green';
        randomButton2.style.backgroundColor = 'grey';
        activeButton = randomButton1;
    } else {
        randomButton1.style.backgroundColor = 'grey';
        randomButton2.style.backgroundColor = 'green';
        activeButton = randomButton2;
    }
}

function playAnimation() {
    isAnimating = true;
    let currentFrame = 0;
    const frameDuration = 100; // Time between frames in milliseconds

    function animate() {
        animationFrame.src = frames[currentFrame];

        if (currentFrame === 0) startSound.play();
        if (currentFrame === 2) frame3Sound.play();
        if (currentFrame === 4) frame5Sound.play();

        currentFrame++;
        if (currentFrame < frames.length) {
            setTimeout(animate, frameDuration); // Control speed using setTimeout
        } else {
            isAnimating = false;
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            assignButtonColors();
        }
    }

    setTimeout(animate, frameDuration); // Initial call with a delay
}

function handleButtonClick(button) {
    if (button === activeButton && !isAnimating) {
        button.style.transform = 'scale(1.1)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
        playAnimation();
    }
}

document.getElementById('start-button').addEventListener('click', () => {
    menuScreen.style.display = 'none';
    gameContainer.style.display = 'flex';
    assignButtonColors();
});

document.getElementById('highscores-button').addEventListener('click', () => {
    menuScreen.style.display = 'none';
    highscoresScreen.style.display = 'flex';
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highscoresList.innerHTML = '';
    highScores.slice(0, 5).forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `#${index + 1} - ${score}`;
        highscoresList.appendChild(li);
    });
});

document.getElementById('exit-button').addEventListener('click', () => window.close());
document.getElementById('back-to-menu-button').addEventListener('click', () => {
    highscoresScreen.style.display = 'none';
    menuScreen.style.display = 'flex';
});

[randomButton1, randomButton2].forEach(button => {
    button.addEventListener('click', () => handleButtonClick(button));
});
