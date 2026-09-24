var Player = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  onGround: false,
  angle: 0,
  facing: 1
};

Player.reset = function () {
  Player.x = Level.startX;
  Player.y = Level.startY;
  Player.vx = 0;
  Player.vy = 0;
  Player.onGround = false;
  Player.angle = 0;
};

Player.update = function () {
  var size = CONFIG.PLAYER_SIZE;

  Player.vx = 0;
  if (Input.left)  { Player.vx = -CONFIG.MOVE_SPEED; Player.facing = -1; }
  if (Input.right) { Player.vx =  CONFIG.MOVE_SPEED; Player.facing = 1; }

  if (Input.jump && Player.onGround) {
    Player.vy = -CONFIG.JUMP_POWER;
    Player.onGround = false;
  }

  Player.vy = Player.vy + CONFIG.GRAVITY;
  if (Player.vy > CONFIG.MAX_FALL) { Player.vy = CONFIG.MAX_FALL; }

  var stepX = Player.vx > 0 ? 1 : (Player.vx < 0 ? -1 : 0);
  for (var i = 0; i < Math.abs(Player.vx); i++) {
    if (Collide.hitsSolid(Player.x + stepX, Player.y, size, size)) { break; }
    Player.x = Player.x + stepX;
    Player.angle = Player.angle + stepX / CONFIG.PLAYER_RADIUS;
  }

  var stepY = Player.vy > 0 ? 1 : (Player.vy < 0 ? -1 : 0);
  Player.onGround = false;
  for (var j = 0; j < Math.abs(Player.vy); j++) {
    if (Collide.hitsSolid(Player.x, Player.y + stepY, size, size)) {
      if (stepY > 0) { Player.onGround = true; }
      Player.vy = 0;
      break;
    }
    Player.y = Player.y + stepY;
  }

  if (Player.x < 0) { Player.x = 0; }
};

Player.isDead = function () {
  var size = CONFIG.PLAYER_SIZE;
  if (Collide.hitsSpike(Player.x, Player.y, size, size)) { return true; }
  if (Game.hitsDragon(Player.x, Player.y, size, size)) { return true; }
  if (Player.y > CONFIG.CANVAS_H + 200) { return true; }
  return false;
};

Player.hasWon = function () {
  return Collide.hitsFinish(Player.x, Player.y, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE);
};
