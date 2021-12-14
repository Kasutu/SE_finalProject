// init
// canvas settings
let canvas;
let ctx;
let width = 800;
let height = 400;

// gameLoop vars
let currentTime = Date.now();
let elapsedTime;
let lastFrame = 0;
let fps;
let gameStart = true;

// physics vars
const friction = 8;
const gravity = 8;

// keyboard direction
let direction = {
  up: false,
  down: false,
  left: false,
  right: false,
};

// executes when page is loaded
window.onload = pageLoad();

// start or pause the game
function playGame(val) {
  if (val === 'play') {
    gameStart = true;
    pageLoad();
  }

  if (val === 'pause') {
    gameStart = false;
  }
}

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
  update(delta === true);
  render();
  // console.log(`Elapsed: ${elapsedTime}`);

  if (gameStart) {
    requestAnimationFrame(gameLoop);
  }
}

// class data
class PlayerObj {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // attributes
    this.speed = speed;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isJumping = true;
    this.isOnFloor = false;
  }

  draw() {
    //stroke rectangle
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}

class PlatformObj {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // attributes
    this.speed = 0;
    this.velocityX = 0;
    this.velocityY = 0;
  }

  draw() {
    //stroke rectangle
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}

// init for physics
let player;
let platform;
let playerAttrib = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 16,
  height: 16,
  movementSpeed: 5,
};

//detects keypress and moves the player
// optimize these later for speed
addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      //up
      direction.up = true;
      console.log('arrow up');
      break;
    // case 'ArrowDown':
    //   //down
    //   direction.down = true;
    //   break;
    case 'ArrowLeft':
      //left
      direction.left = true;
      break;
    case 'ArrowRight':
      //right
      direction.right = true;
      break;
  }
});

addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      //up
      direction.up = false;
      break;
    // case 'ArrowDown':
    //   //down
    //   direction.down = false;
    //   break;
    case 'ArrowLeft':
      //left
      direction.left = false;
      break;
    case 'ArrowRight':
      //right
      direction.right = false;
      break;
  }
});

// physics calculation
function update() {
  //entity creation
  player = new PlayerObj(
    playerAttrib.x - playerAttrib.width / 2,
    playerAttrib.y - playerAttrib.height / 2,
    playerAttrib.width,
    playerAttrib.height,
    playerAttrib.movementSpeed
  );
  platform = new PlatformObj(0, height - 50, width, 50);

  // movement and position calculation
  if (direction.up && !player.isJumping && player.isOnFloor) {
    player.isJumping = true;
    player.isOnFloor = false;
    player.velocityY = -player.speed * 2;
  }

  if (direction.right && player.velocityX < player.speed) {
    player.velocityX += 1;
    player.isJumping = false;
  }

  if (direction.left && player.velocityX > -player.speed) {
    player.velocityX -= 1;
    player.isJumping = false;
  }

  // computes the final velocity
  player.velocityX *= friction;
  player.velocityY += gravity;

  // border and obstacles update

  // collision checks
  let grounded = floorCollision(player, platform);
  player.isOnFloor = grounded;

  if (grounded) {
    player.isOnFloor = true;
    player.isJumping = false;
    player.velocityY *= -1;
  }

  if (player.isOnFloor) {
    player.velocityY = 0;
  }

  // final position values
  playerAttrib.x += player.velocityX;
  playerAttrib.y += player.velocityY;

  // console.log(playerAttrib.x, playerAttrib.y, floorCollision(player, platform));
}

// implementation
function render() {
  // Clear the entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //render
  player.draw();
  platform.draw();

  // debug render
  addLineTrack(player, platform);

  // Draw number to the screen
  ctx.font = '18px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(`FPS: ${fps}`, 10, 20);
  ctx.fillText(`Elapsed: ${elapsedTime}s`, 10, 40);
  ctx.fillText(`player: x: ${player.x} y: ${player.y}`, 10, 60);
  ctx.fillText(`platform: x: ${platform.x} y: ${platform.y}`, 10, 80);
  ctx.fillText(`player delta-V: ${player.velocityY}m/s`, 10, 100);
}

// collision detection
function floorCollision(obj1, obj2) {
  if (obj1.y + obj1.height >= obj2.y) {
    return true;
  }
}

// shows distance visually between 2 objects
function addLineTrack(target1, target2) {
  let startX = target1.x + target1.width / 2;
  let startY = target1.y + target1.height / 2;
  let endX = target2.x + target2.width / 2;
  let endY = target2.y + target2.height / 2;

  ctx.beginPath();
  ctx.moveTo(startX, startY); // start coord
  ctx.lineTo(endX, endY); // end coord
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'blue';
  ctx.lineCap = 'round';
  ctx.stroke();
}
