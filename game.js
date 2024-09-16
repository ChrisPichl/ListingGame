const frames = ['./assests/1.webp', './assests/2.webp', './assests/3.webp', './assests/4.webp', './assests/5.webp', './assests/6.webp'];
const startSound = new Audio('./assests/game.mp3');
const frame3Sound = new Audio('./assests/in.mp3');
const frame5Sound = new Audio('./assests/out.mp3');

frame3Sound.playbackRate = 3.0;
frame5Sound.playbackRate = 1.5;

const animationFrame = document.getElementById('animation-frame');
const randomButton = document.getElementById('random-button');
const scoreDisplay = document.getElementById('score-display');
const menuScreen = document.getElementById('menu-screen');
const gameContainer = document.querySelector('.game-container');
const gameOverScreen = document.getElementById('game-over-screen');
const highscoresScreen = document.getElementById('highscores-screen');
const highscoresList = document.getElementById('highscores-list');
const restartButton = document.getElementById('restart-button');

let isAnimating = false;
let score = 0;
let lastClickTime = Date.now(); // Initialize lastClickTime

// Array of possible button positions
const buttonPositions = [
    { top: '0%', left: '0%' },
    { top: '0%', left: '25%' },
    { top: '0%', left: '50%' },
    { top: '0%', left: '75%' },
    { top: '50%', left: '0%' },
    { top: '50%', left: '25%' },
    { top: '50%', left: '50%' },
    { top: '50%', left: '75%' }
];

function assignButtonPosition() {
    const randomIndex = Math.floor(Math.random() * buttonPositions.length);
    const position = buttonPositions[randomIndex];
    randomButton.style.top = position.top;
    randomButton.style.left = position.left;
}

function playAnimation() {
    isAnimating = true;
    let currentFrame = 0;
    const frameDuration = 80; // Time between frames in milliseconds
    assignButtonPosition(); // Reassign button position after animation

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
        }
    }

    setTimeout(animate, frameDuration); // Initial call with a delay
}

function handleButtonClick() {
    const currentTime = Date.now();
    if (!isAnimating) {
        randomButton.style.transform = 'scale(1.1)';
        setTimeout(() => {
            randomButton.style.transform = 'scale(1)';
        }, 150);
        playAnimation();
        lastClickTime = currentTime; // Update lastClickTime only when animation starts
    }
}

function gameLoop() {
    const timeDifference = Date.now() - lastClickTime;

    if (timeDifference > 3000) { // Game Over
        gameOverScreen.style.display = 'flex';
        gameContainer.style.display = 'none';
        return; // Exit the loop
    }
console.log(timeDifference);

    requestAnimationFrame(gameLoop);
}

document.getElementById('start-button').addEventListener('click', () => {
    menuScreen.style.display = 'none';
    gameContainer.style.display = 'flex';
    lastClickTime = Date.now();  // Set the current time at the game start
    assignButtonPosition();
    gameLoop();  // Start the game loop
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

document.getElementById('back-to-menu-button').addEventListener('click', () => {
    highscoresScreen.style.display = 'none';
    menuScreen.style.display = 'flex';
});

randomButton.addEventListener('click', handleButtonClick);

// Restart Button Logic
restartButton.addEventListener('click', () => {
    gameOverScreen.style.display = 'none';  // Hide the game over screen
    menuScreen.style.display = 'flex';      // Show the menu screen
    gameContainer.style.display = 'none';   // Hide the game container
    lastClickTime = Date.now();             // Reset the lastClickTime to the current time
    score = 0;                              // Reset score
    scoreDisplay.textContent = `Score: ${score}`;
    isAnimating = false;                    // Reset animation flag
});
