// Canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Global size-related variables
let canvasWidth = window.innerWidth; // Dynamic canvas width
let canvasHeight = window.innerHeight; // Dynamic canvas height
let birdWidth = 80; // Width of the bird (player character)
let birdHeight = 80; // Height of the bird (player character)
let pipeWidth = 100; // Width of the pipes
let basePipeGap = canvasHeight / 4; // Base vertical gap between pipes
let pipeGap = basePipeGap * 2; // Adjusted gap between pipes (10% larger)
let jumpHeight = (pipeGap * 2) / 7; // Vertical jump height (2/3 of pipe gap)
let pipeSpeed = 2 * 1.15; // Speed at which pipes move to the left (15% faster)
let parallaxSpeed = (pipeSpeed / 2) * 1.15; // Speed of the background scrolling (15% faster)
let pipeInterval = Math.ceil(160 / 1.15); // Interval (in frames) for new pipe generation, reduced for faster gameplay
let pipeSpacing = pipeInterval * 2; // Double the interval for pipe spacing
let fontSize = 60 * 2; // Base font size (200% larger)
let rainOffsetX = 0; // Parallax offset for the rain effect

// Bird setup (position recalculated dynamically in resizeCanvas)
let bird = {
  x: canvasWidth / 2 - birdWidth / 2, // Center horizontally
  y: canvasHeight / 2 - birdHeight / 2, // Center vertically
  width: birdWidth,
  height: birdHeight,
  gravity: 0.25,
  lift: -Math.sqrt(2 * jumpHeight * 0.25),
  velocity: 0,
  rotation: 0,
};

// Dynamically set canvas size and adjust bird's position to center
function resizeCanvas() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  basePipeGap = canvasHeight / 4; // Recalculate base pipe gap
  pipeGap = basePipeGap * 1.1; // Adjust pipe gap for new height
  jumpHeight = (pipeGap * 2) / 3; // Adjust jump height

  // Re-center the bird horizontally and vertically
  bird.x = canvasWidth / 2 - birdWidth / 2;
  bird.y = canvasHeight / 2 - birdHeight / 2;
}

// Initial canvas size and attach resize listener
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const background = new Image();
background.src = 'Background.png';

// Snake images for pipes
const snakeImages = [
  { src: 'pillar2.png', image: new Image() },
 // { src: 'snake2.png', image: new Image() },
];
snakeImages.forEach((snake) => (snake.image.src = snake.src));

const playerImage = new Image();
playerImage.src = 'FagC.png';

let backgroundX = 0;

let pipes = [];
let frame = 0;
let score = 0;
let isGameOver = false;
let isGameStarted = false;

// Updates the rain overlay's parallax effect
function updateRainParallax() {
  if (isGameStarted) {
    rainOffsetX -= parallaxSpeed; // Move the rain at the same speed as the background
    document.getElementById('rainOverlay').style.backgroundPosition = `${rainOffsetX}px 0`; // Update background position
  }
}

function addPipe() {
  const pipeHeight = Math.random() * (canvasHeight - pipeGap - 50) + 20;
  const selectedSnake = snakeImages[Math.floor(Math.random() * snakeImages.length)];

  pipes.push(
    {
      x: canvasWidth,
      y: 0,
      width: pipeWidth,
      height: pipeHeight,
      gap: pipeGap,
      passed: false, // Track if pipe has been passed
      image: selectedSnake.image, // Randomly selected snake image
      flipped: true, // This is the top pipe, so it's flipped
    },
    {
      x: canvasWidth,
      y: pipeHeight + pipeGap,
      width: pipeWidth,
      height: canvasHeight - (pipeHeight + pipeGap),
      gap: pipeGap,
      passed: false,
      image: selectedSnake.image,
      flipped: false, // Bottom pipe is not flipped
    }
  );
}

function drawPipes() {
  pipes.forEach((pipe) => {
    if (pipe.flipped) {
      // Draw flipped pipe (top pipe)
      ctx.save();
      ctx.translate(pipe.x + pipe.width / 2, pipe.height);
      ctx.scale(1, -1); // Flip vertically
      ctx.drawImage(pipe.image, -pipe.width / 2, 0, pipe.width, pipe.height);
      ctx.restore();
    } else {
      // Draw normal pipe (bottom pipe)
      ctx.drawImage(pipe.image, pipe.x, pipe.y, pipe.width, pipe.height);
    }
  });
}


function drawBackground() {
  ctx.drawImage(background, backgroundX, 0, canvasWidth, canvasHeight);
  ctx.drawImage(background, backgroundX + canvasWidth, 0, canvasWidth, canvasHeight);

  if (isGameStarted) {
    backgroundX -= parallaxSpeed;
  }

  if (backgroundX <= -canvasWidth) {
    backgroundX = 0;
  }
}

function drawBird() {
  ctx.save();
  ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
  ctx.rotate((bird.rotation * Math.PI) / 180);
  ctx.drawImage(
    playerImage,
    -bird.width / 2,
    -bird.height / 2,
    bird.width,
    bird.height
  );
  ctx.restore();
}

function updatePipes() {
  pipes.forEach((pipe, index) => {
    pipe.x -= pipeSpeed;

// Increment score if the bird passes a pipe pair
if (!pipe.passed && bird.x > pipe.x + pipe.width) {
  score += 0.5; // Increment score by 0.5 instead of 1
  pipe.passed = true; // Mark the pipe pair as passed
}


    // Remove pipe if off-screen
    if (pipe.x + pipe.width < 0) {
      pipes.splice(index, 1);
    }

    // Collision detection
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x
    ) {
      if (pipe.flipped) {
        // Top pipe collision
        if (bird.y < pipe.height) {
          isGameOver = true;
        }
      } else {
        // Bottom pipe collision
        if (bird.y + bird.height > pipe.y) {
          isGameOver = true;
        }
      }
    }
  });
}


function drawScore() {
  const scoreX = 20; // Fixed margin from the left
  const scoreY = fontSize + 10; // Position below the top edge dynamically

  ctx.fillStyle = 'red';
  ctx.font = `${fontSize}px Canterbury`;
  ctx.textAlign = 'start'; // Ensure text is aligned to the start of the x-coordinate
  ctx.fillText(`Score: ${score}`, scoreX, scoreY);
}

function drawStartScreen() {
  // Draw background overlay for readability
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Title in Maskdown font
  ctx.fillStyle = 'white';
  const titleFontSize = fontSize * 2;
  ctx.font = `${titleFontSize}px Maskdown`;
  ctx.textAlign = 'center';

  const flappyX = canvasWidth / 2 - 280;
  const titleY = canvasHeight / 2 - 150;
  ctx.fillText('Flapy', flappyX, titleY);

  const mirroredBird = 'Driib';
  const mirroredBirdX = canvasWidth / 2 + 300;
  const mirroredBirdY = titleY;

  ctx.save();
  ctx.translate(mirroredBirdX, mirroredBirdY);
  ctx.scale(-1, 1);
  ctx.fillText(mirroredBird, 0, 0);
  ctx.restore();

  ctx.fillStyle = 'red';
  const subTextFontSize = fontSize;
  ctx.font = `${subTextFontSize}px Canterbury`;
  const subTextY = canvasHeight / 2 + 150;
  ctx.fillText('Click to Start', canvasWidth / 2, subTextY);
}

function drawGameOverScreen() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = 'white';
  ctx.font = `${fontSize}px Canterbury`;
  ctx.fillText('Game Over!', canvasWidth / 2 - 200, canvasHeight / 2 - 100);
  ctx.fillText(`Your Score: ${score}`, canvasWidth / 2 - 200, canvasHeight / 2);
  ctx.fillStyle = 'red';
  ctx.fillText('Click to Restart', canvasWidth / 2 - 300, canvasHeight / 2 + 100);
}

function gameLoop() {
  if (isGameOver) {
    drawGameOverScreen();
    return;
  }

  drawBackground();

  if (!isGameStarted) {
    drawStartScreen();
    requestAnimationFrame(gameLoop);
    return;
  }

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
  bird.rotation = bird.velocity > 0 ? Math.min(bird.velocity * 4, 20) : -20;

  if (bird.y + bird.height > canvasHeight) {
    bird.y = canvasHeight - bird.height;
    isGameOver = true;
  }

  if (bird.y < 0) {
    bird.y = 0;
    isGameOver = true;
  }

  if (frame % pipeSpacing === 0) {
    addPipe();
  }

  drawBird();
  drawPipes();
  drawScore();
  updatePipes();
  updateRainParallax(); // Apply parallax effect to rain during gameplay

  frame++;
  requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', () => {
  if (isGameOver) {
    // Restart the game
    isGameOver = false;
    isGameStarted = false;
    pipes = [];
    bird.y = canvasHeight / 2 - birdHeight / 2; // Re-center the bird vertically
    bird.velocity = 0;
    score = 0;
    frame = 0;
    gameLoop();
  } else if (!isGameStarted) {
    isGameStarted = true;
  } else {
    // Make the bird jump on click
    bird.velocity = bird.lift;
    bird.rotation = -20;
  }
});

gameLoop();
