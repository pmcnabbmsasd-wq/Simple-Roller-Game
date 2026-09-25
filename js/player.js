var Player = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  width: CONFIG.PLAYER_SIZE,
  height: CONFIG.PLAYER_SIZE,
  facing: 1,
  angle: 0,
  onGround: false,
  dead: false,
  won: false
};

Player.reset = function () {
  Player.x = Level.startX;
  Player.y = Level.startY;
  Player.vx = 0;
  Player.vy = 0;
  Player.facing = 1;
  Player.angle = 0;
  Player.onGround = false;
  Player.dead = false;
  Player.won = false;
};

Player.update = function () {
  Player.dead = false;
  Player.won = false;

  var move = 0;
  if (Input.left) { move -= 1; }
  if (Input.right) { move += 1; }

  if (move !== 0) {
    Player.vx = move * CONFIG.MOVE_SPEED;
    Player.facing = move;
  } else {
    Player.vx = 0;
  }

  if (Input.jump && Player.onGround) {
    Player.vy = -CONFIG.JUMP_POWER;
    Player.onGround = false;
  }

  var nextX = Player.x + Player.vx;
  if (!Collide.hitsSolid(nextX, Player.y, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE)) {
    Player.x = nextX;
  }

  Player.vy = Math.min(Player.vy + CONFIG.GRAVITY, CONFIG.MAX_FALL);
  var nextY = Player.y + Player.vy;
  if (!Collide.hitsSolid(Player.x, nextY, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE)) {
    Player.y = nextY;
    Player.onGround = false;
  } else {
    Player.vy = 0;
    Player.onGround = true;
  }

  if (Player.x < 0) { Player.x = 0; }
  if (Player.x + CONFIG.PLAYER_SIZE > Level.pixelWidth()) {
    Player.x = Level.pixelWidth() - CONFIG.PLAYER_SIZE;
  }

  if (Collide.hitsSpike(Player.x, Player.y, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE)) {
    Player.dead = true;
  }
  if (Player.y > CONFIG.CANVAS_H + 80) {
    Player.dead = true;
  }
  if (Collide.hitsFinish(Player.x, Player.y, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE)) {
    Player.won = true;
  }

  if (Player.vx !== 0 || Player.vy !== 0) {
    Player.angle = Math.atan2(Player.vy, Player.vx || 1);
  }
};

Player.isDead = function () {
  return Player.dead;
};

Player.hasWon = function () {
  return Player.won;
};
