// Assets
const frames = ['./assests/1.webp', './assests/2.webp', './assests/3.webp', './assests/4.webp', './assests/5.webp', './assests/6.webp', './assests/1.webp'];
const startSound = new Audio('./assests/game.mp3');
const frame3Sound = new Audio('./assests/in.mp3');
const frame5Sound = new Audio('./assests/out.mp3');

// Configure sound properties
frame3Sound.playbackRate = 3.0;
frame5Sound.playbackRate = 1.5;
startSound.volume = 0.3;
startSound.loop = true; // Set this to true to loop the sound

// Preload assets
const preloadAssets = () => {
    frames.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    [startSound, frame3Sound, frame5Sound].forEach(sound => {
        sound.preload = 'auto';
    });
};

preloadAssets();

// DOM Elements
const animationFrame = document.getElementById('animation-frame');
const randomButton = document.getElementById('random-button');
const scoreDisplay = document.getElementById('score-display');
const menuScreen = document.getElementById('menu-screen');
const gameContainer = document.querySelector('.game-container');
const gameOverScreen = document.getElementById('game-over-screen');
const highscoresScreen = document.getElementById('highscores-screen');
const highscoresList = document.getElementById('highscores-list');
const restartButton = document.getElementById('restart-button');
const startButton = document.getElementById('start-button');
const highscoresButton = document.getElementById('highscores-button');
const backToMenuButton = document.getElementById('back-to-menu-button');

// Game State
let isAnimating = false;
let score = 0;
let lastClickTime = Date.now();

// Assign random button position
const buttonMargin = 6; // 5px margin

const buttonPositions = [
    { top: '0%', left: `calc(0% + ${buttonMargin}px)` },
    { top: '0%', left: `calc(25% + ${buttonMargin}px)` },
    { top: '0%', left: `calc(50% + ${buttonMargin}px)` },
    { top: '0%', left: `calc(75% + ${buttonMargin}px)` },
    { top: '50%', left: `calc(0% + ${buttonMargin}px)` },
    { top: '50%', left: `calc(25% + ${buttonMargin}px)` },
    { top: '50%', left: `calc(50% + ${buttonMargin}px)` },
    { top: '50%', left: `calc(75% + ${buttonMargin}px)` }
];


let positionIndices = Array.from(buttonPositions.keys()); // [0, 1, 2, ..., 7]
let currentIndex = 0;

// Shuffle function to randomize the positions array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

// Shuffle the position indices array
positionIndices = shuffleArray(positionIndices);

function assignButtonPosition() {
    // Get the current position index
    const positionIndex = positionIndices[currentIndex];
    const position = buttonPositions[positionIndex];
    
    // Apply the new position
    randomButton.style.top = position.top;
    randomButton.style.left = position.left;
    
    // Update current index
    currentIndex = (currentIndex + 1) % positionIndices.length;
}

// Example usage
assignButtonPosition(); // Call this function whenever you need to assign a position


// Play animation function
function playAnimation() {
    isAnimating = true;
    let currentFrame = 0;
    const frameDuration = 80;
    const totalFrames = frames.length;
    let startTime = null;

    
    
    function animate(timestamp) {
        if (startTime === null) {
            startTime = timestamp;
        }
        
        const elapsedTime = timestamp - startTime;
        const frameIndex = Math.floor(elapsedTime / frameDuration);
        
        if (frameIndex >= totalFrames) {
            isAnimating = false;
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            if(frameIndex == totalFrames)
               { assignButtonPosition(); // Reassign button position
                randomButton.style.zIndex = 1
        }
            return;
        }

        if (frameIndex !== currentFrame) {
            currentFrame = frameIndex;
            animationFrame.src = frames[currentFrame];

            if (currentFrame === 2) frame3Sound.play();
            if (currentFrame === 4) frame5Sound.play();
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

// Handle button click
function handleButtonClick() {
    if (!isAnimating) {
        randomButton.style.zIndex = -1;
        playAnimation();
        lastClickTime = Date.now();
    }
}

// Game loop function
function gameLoop() {
    if (Date.now() - lastClickTime > 3000) { // Game Over
        startSound.pause();
        gameOverScreen.style.display = 'flex';
        gameContainer.style.display = 'none';
        return;
    }
    
    requestAnimationFrame(gameLoop);
}

// Event Listeners
startButton.addEventListener('click', () => {
    menuScreen.style.display = 'none';
    gameContainer.style.display = 'flex';
    lastClickTime = Date.now();
    assignButtonPosition();
    gameLoop();
    startSound.play();
});

highscoresButton.addEventListener('click', () => {
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

backToMenuButton.addEventListener('click', () => {
    highscoresScreen.style.display = 'none';
    menuScreen.style.display = 'flex';
});

randomButton.addEventListener('click', handleButtonClick);

restartButton.addEventListener('click', () => {
    gameOverScreen.style.display = 'none';
    menuScreen.style.display = 'flex';
    gameContainer.style.display = 'none';
    lastClickTime = Date.now();
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    isAnimating = false;
});
