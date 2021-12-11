// init
let canvas;
let ctx;
let currentTime = Date.now();
let elapsedTime;
let lastFrame = 0;
let width = 800;
let height = 400;
let friction = 0.8;
let gravity = 1;
let fps;

// executes when page is loaded
window.onload = pageLoad();

function pageLoad() {
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');

  // sets the canvas width and hight dynamically
  canvas.width = width;
  canvas.height = height;

  // first animation request
  requestAnimationFrame(gameLoop);
}

function gameLoop(currentTime) {
  // Calculate how much time has passed
  delta = (currentTime - lastFrame) / 1000;
  lastFrame = currentTime;
  elapsedTime = Math.trunc(lastFrame / 1000);

  // Calculate fps
  fps = Math.round(1 / delta);

  // Pass the delta time to the update
  // Game logic here
  update();
  render();
  // console.log(`Elapsed: ${elapsedTime}`);

  if (false) {
    requestAnimationFrame(gameLoop);
  }
}

// class data
class Player {
  constructor(x, y, width, height, movementSpeed) {
    this.x = x;
    this.y = y;
    this.velocityX = movementSpeed;
    this.velocityY = movementSpeed;
    this.width = width;
    this.height = height;
    this.isJumping = false;
    this.isGrounded = false;
  }

  draw() {
    //stroke rectangle
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}

class platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    //stroke rectangle
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}

let player;
let player_x = canvas.width / 2;
let player_y = canvas.height / 2;

//detects keypress and moves the player
addEventListener('keydown', () => {
  switch (event.key) {
    case 'ArrowUp':
      //up
      player_y -= 50;

      // console.log('up');
      break;
    case 'ArrowDown':
      //down
      player_y += 50;
      // console.log('down');
      break;
    case 'ArrowLeft':
      //left
      player_x -= 50;

      // console.log('left');
      break;
    case 'ArrowRight':
      //right
      player_x += 50;
      // console.log('right');
      break;
  }
});

// physics
function update() {
  //entity creation
  player = new Player(player_x - 16, player_y - 16, 32, 32, 2);

  // floor detection
  if (player.y + player.height > canvas.height) {
    player.velocityY = 0;
  } else {
    player.velocityX *= friction;
    player.velocityY += gravity;
  }

  // moves the player
  // player_x += player.velocityX;
  player_y += player.velocityY;
}

// implementation
function render() {
  // Clear the entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //render
  player.draw();
  console.log(`Player: ${player.x}x ${player.y}y`);

  // Draw number to the screen
  ctx.font = '25px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(`FPS: ${fps}`, 10, 30);
  ctx.fillText(`Elapsed: ${elapsedTime}s`, 10, 60);
}
