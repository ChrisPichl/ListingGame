const frames = [
    './assests/1.png',
    './assests/2.png',
    './assests/3.png',
    './assests/4.png',
    './assests/5.png',
    './assests/6.png',
];

// Audio files
const startSound = new Audio('./assests/game.wav');
const frame3Sound = new Audio('./assests/in.wav');
const frame5Sound = new Audio('./assests/out.wav');

// Set playback rates for specific sounds
frame3Sound.playbackRate = 3.0;  // 3.0x speed for frame 3 sound
frame5Sound.playbackRate = 1.5;  // 1.5x speed for frame 5 sound

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
let isAnimating = false;  // Flag to check if animation is running
let score = 0;  // Initialize score

// Function to randomly assign red or green colors to the buttons
function assignButtonColors() {
    if (isAnimating) return;  // Do not assign colors if animation is running

    // Randomly choose a button to be active with 2/3 chance for the inactive button to become active
    const randomChoice = Math.random();
    
    if (randomChoice > 0.33) {
        // 1/3 chance for randomButton1 to be active
        randomButton1.style.backgroundColor = 'green';  // Active button
        randomButton2.style.backgroundColor = 'grey'; // Inactive button
        activeButton = randomButton1;
    } else {
        // 2/3 chance for randomButton2 to be active
        randomButton1.style.backgroundColor = 'grey'; // Inactive button
        randomButton2.style.backgroundColor = 'green';   // Active button
        activeButton = randomButton2;
    }
}

// Function to play frame-by-frame animation
function playAnimation() {
    isAnimating = true;  // Set the flag to true when animation starts
    let currentFrame = 0;

    const interval = setInterval(() => {
        animationFrame.src = frames[currentFrame];

        // Play sound at the start of the game (first time animation starts)
        if (currentFrame === 0) { 
            startSound.play();
        }

        // Play sound when the third frame appears
        if (currentFrame === 2) {
            frame3Sound.play();
        }

        // Play sound when the fifth frame appears
        if (currentFrame === 4) {
            frame5Sound.play();
        }

        currentFrame++;

        if (currentFrame >= frames.length) {
            clearInterval(interval);
            isAnimating = false;  // Set the flag to false when animation ends
            score++;  // Increase the score
            scoreDisplay.textContent = `Score: ${score}`;  // Update the score display
            assignButtonColors();  // Assign button colors after animation finishes
        }
    }, 80);  // Change frames every 80ms (adjust this speed if needed)
}

// Function to handle button click and scale effect
function handleButtonClick(button) {
    if (button === activeButton && !isAnimating) {
        // Apply scale effect
        button.style.transform = 'scale(1.1)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';  // Revert to original scale
        }, 150);  // Scale effect duration

        playAnimation();  // Start the animation if the active button is clicked and not animating
    }
}

// Function to show the game over screen
function showGameOverScreen() {
    gameOverScreen.style.display = 'flex';  // Show the Game Over screen
}

// Function to start the game
function startGame() {
    menuScreen.style.display = 'none';  // Hide menu screen
    gameContainer.style.display = 'flex';  // Show game container
    assignButtonColors();
}

// Function to show high scores
function showHighScores() {
    menuScreen.style.display = 'none';  // Hide menu screen
    highscoresScreen.style.display = 'flex';  // Show high scores screen
    // Fetch high scores from local storage
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highscoresList.innerHTML = '';
    highScores.slice(0, 5).forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `#${index + 1} - ${score}`;
        highscoresList.appendChild(li);
    });
}

// Function to exit the game
function exitGame() {
    window.close();  // Attempt to close the window (note: may not work in all browsers)
}

// Event listeners for buttons
document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('highscores-button').addEventListener('click', showHighScores);
document.getElementById('exit-button').addEventListener('click', exitGame);
document.getElementById('back-to-menu-button').addEventListener('click', () => {
    highscoresScreen.style.display = 'none';  // Hide high scores screen
    menuScreen.style.display = 'flex';  // Show menu screen
});

[randomButton1, randomButton2].forEach(button => {
    button.addEventListener('click', () => {
        handleButtonClick(button);
    });
});

// Initialize the menu screen
menuScreen.style.display = 'flex';
