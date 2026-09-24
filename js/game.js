/* =====================================================================
   game.js  --  THE RULES AND THE LOOP.
   ===================================================================== */

var Game = {
  mode: "playing",
  levelNumber: 0,
  lives: CONFIG.STARTING_LIVES,
  laserGunCollected: false,
  bullets: [],
  ammo: 0
};

Game.startLevel = function (levelNumber) {
  Game.levelNumber = levelNumber;
  Game.lives = CONFIG.STARTING_LIVES;
  Game.laserGunCollected = false;
  Game.bullets = [];
  Game.ammo = 0;
  Level.build(levelNumber);
  Player.reset();
  Game.mode = "playing";
  Game.showLives();
  Game.showAmmo();
  Game.showMessage("");
};

Game.showMessage = function (text) {
  document.getElementById("message").textContent = text;
};

Game.showLives = function () {
  document.getElementById("lives").textContent = "Lives: " + Game.lives;
};

Game.showAmmo = function () {
  document.getElementById("ammo").textContent = Game.laserGunCollected
    ? "Laser: " + Game.ammo + "/" + CONFIG.LASER_CLIP_SIZE
    : "Laser: not collected";
};

Game.loseLife = function () {
  Game.lives = Game.lives - 1;
  Game.showLives();

  if (Game.lives <= 0) {
    Game.mode = "dead";
    Game.showMessage("Game over. Press R to try again.");
    return;
  }

  Player.reset();
  Game.bullets = [];
  Game.showMessage("You lost a life. " + Game.lives + " remaining.");
};

Game.checkLaserGun = function () {
  if (Game.laserGunCollected) { return; }

  if (Collide.hitsLaserGun(Player.x, Player.y, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE)) {
    Game.laserGunCollected = true;
    Game.ammo = CONFIG.LASER_CLIP_SIZE;
    Game.showAmmo();
    Game.showMessage("Laser gun collected! Press X to shoot; press E to reload.");
  }
};

Game.shoot = function () {
  if (!Game.laserGunCollected) { return; }
  if (Game.ammo <= 0) {
    Game.showMessage("Out of bullets. Press E to reload.");
    return;
  }

  var direction = Player.facing;
  Game.bullets.push({
    x: Player.x + (direction > 0 ? CONFIG.PLAYER_SIZE : -8),
    y: Player.y + CONFIG.PLAYER_SIZE / 2 - 2,
    vx: CONFIG.LASER_SPEED * direction,
    distance: 0
  });
  Game.ammo = Game.ammo - 1;
  Game.showAmmo();
};

Game.reload = function () {
  if (!Game.laserGunCollected) { return; }
  if (Game.ammo === CONFIG.LASER_CLIP_SIZE) {
    Game.showMessage("Laser magazine is already full.");
    return;
  }
  Game.ammo = CONFIG.LASER_CLIP_SIZE;
  Game.showAmmo();
  Game.showMessage("Laser reloaded.");
};

Game.updateBullets = function () {
  for (var i = Game.bullets.length - 1; i >= 0; i--) {
    var bullet = Game.bullets[i];
    bullet.x = bullet.x + bullet.vx;
    bullet.distance = bullet.distance + Math.abs(bullet.vx);

    if (bullet.distance >= CONFIG.LASER_RANGE ||
        Collide.hitsSolid(bullet.x, bullet.y, 8, 4) ||
        bullet.x < 0 || bullet.x > Level.pixelWidth()) {
      Game.bullets.splice(i, 1);
    }
  }
};

// --- ONE FRAME --------------------------------------------------------
Game.update = function () {
  if (Input.restart) {
    Game.startLevel(Game.levelNumber);
    return;
  }

  if (Game.mode !== "playing") { return; }

  Player.update();
  Game.checkLaserGun();

  if (Input.shoot) {
    Game.shoot();
    Input.shoot = false;
  }
  if (Input.reload) {
    Game.reload();
    Input.reload = false;
  }
  Game.updateBullets();

  if (Player.isDead()) {
    Game.loseLife();
    return;
  }

  if (Player.hasWon()) {
    Game.mode = "won";
    Game.showMessage("You made it. Press R to play again.");
    return;
  }
};

Game.loop = function () {
  Game.update();
  Draw.updateCamera();
  Draw.everything();
  window.requestAnimationFrame(Game.loop);
};
