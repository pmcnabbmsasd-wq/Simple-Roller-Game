var Game = {
  mode: "playing",
  levelNumber: 0,
  lives: CONFIG.STARTING_LIVES,
  laserGunCollected: false,
  bullets: [],
  dragons: [],
  ammo: 0,
  dragonCount: 3
};

Game.startLevel = function (levelNumber) {
  if (levelNumber < 0 || levelNumber >= Level.levels.length) { return; }
  Game.levelNumber = levelNumber;
  Game.lives = CONFIG.STARTING_LIVES;
  Game.laserGunCollected = false;
  Game.bullets = [];
  Game.dragons = [];
  Game.ammo = 0;
  Game.dragonCount = (levelNumber === 1) ? 5 : 3;
  Level.build(levelNumber);
  Player.reset();
  Game.mode = "playing";
  Game.showLives();
  Game.showAmmo();
  Game.showLevel();
  Game.setNextLevelButton(false);
  Game.showMessage("");
};

Game.showMessage = function (text) { document.getElementById("message").textContent = text; };
Game.showLives = function () { document.getElementById("lives").textContent = "Lives: " + Game.lives; };
Game.showLevel = function () {
  document.getElementById("level").textContent = "Level " + (Game.levelNumber + 1) + ": " + Level.name;
};
Game.showAmmo = function () {
  document.getElementById("ammo").textContent = Game.laserGunCollected
    ? "Laser: " + Game.ammo + "/" + CONFIG.LASER_CLIP_SIZE
    : "Laser: not collected";
};
Game.setNextLevelButton = function (enabled) {
  var button = document.getElementById("next-level");
  button.disabled = !enabled;
  button.hidden = !enabled;
};
Game.nextLevel = function () {
  if (Game.levelNumber + 1 < Level.levels.length) {
    Game.startLevel(Game.levelNumber + 1);
  }
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

Game.spawnDragons = function () {
  var startX = Player.x + 220;
  Game.dragons = [];
  for (var i = 0; i < Game.dragonCount; i++) {
    var homeY = Math.max(40, Player.y - 100 + (i % 3) * 60);
    Game.dragons.push({ x: startX + i * 110, y: homeY, homeY: homeY, phase: i * 1.3, alive: true });
  }
};

Game.checkLaserGun = function () {
  if (Game.laserGunCollected) { return; }
  if (Collide.hitsLaserGun(Player.x, Player.y, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE)) {
    Game.laserGunCollected = true;
    Game.ammo = CONFIG.LASER_CLIP_SIZE;
    Game.spawnDragons();
    Game.showAmmo();
    Game.showMessage("Laser gun collected! " + Game.dragonCount + " dragons appeared. X shoots; E reloads.");
  }
};

Game.shoot = function () {
  if (!Game.laserGunCollected) { return; }
  if (Game.ammo <= 0) { Game.showMessage("Out of bullets. Press E to reload."); return; }
  var direction = Player.facing;
  Game.bullets.push({ x: Player.x + (direction > 0 ? CONFIG.PLAYER_SIZE : -8), y: Player.y + CONFIG.PLAYER_SIZE / 2 - 2, vx: CONFIG.LASER_SPEED * direction, distance: 0 });
  Game.ammo = Game.ammo - 1;
  Game.showAmmo();
};

Game.reload = function () {
  if (!Game.laserGunCollected) { return; }
  Game.ammo = CONFIG.LASER_CLIP_SIZE;
  Game.showAmmo();
  Game.showMessage("Laser reloaded.");
};

Game.updateBullets = function () {
  for (var i = Game.bullets.length - 1; i >= 0; i--) {
    var bullet = Game.bullets[i];
    bullet.x += bullet.vx;
    bullet.distance += Math.abs(bullet.vx);
    var removed = false;
    for (var d = Game.dragons.length - 1; d >= 0; d--) {
      var dragon = Game.dragons[d];
      if (dragon.alive && Collide.overlaps(bullet.x, bullet.y, 8, 4, dragon.x, dragon.y, CONFIG.DRAGON_SIZE, CONFIG.DRAGON_SIZE)) {
        dragon.alive = false;
        Game.bullets.splice(i, 1);
        removed = true;
        break;
      }
    }
    if (removed) { continue; }
    if (bullet.distance >= CONFIG.LASER_RANGE || Collide.hitsSolid(bullet.x, bullet.y, 8, 4) || bullet.x < 0 || bullet.x > Level.pixelWidth()) {
      Game.bullets.splice(i, 1);
    }
  }
};

Game.updateDragons = function () {
  for (var i = 0; i < Game.dragons.length; i++) {
    var dragon = Game.dragons[i];
    if (!dragon.alive) { continue; }
    dragon.x -= CONFIG.DRAGON_SPEED;
    dragon.phase += 0.06;
    dragon.y = dragon.homeY + Math.sin(dragon.phase) * 28;
  }
};

Game.hitsDragon = function (x, y, width, height) {
  for (var i = 0; i < Game.dragons.length; i++) {
    var dragon = Game.dragons[i];
    if (dragon.alive && Collide.overlaps(x, y, width, height, dragon.x, dragon.y, CONFIG.DRAGON_SIZE, CONFIG.DRAGON_SIZE)) { return true; }
  }
  return false;
};

Game.update = function () {
  if (Input.restart) { Game.startLevel(Game.levelNumber); return; }
  if (Input.nextLevel && Game.mode === "won") { Game.nextLevel(); Input.nextLevel = false; return; }
  if (Game.mode !== "playing") { return; }

  Player.update();
  Game.checkLaserGun();
  Game.updateDragons();
  if (Input.shoot) { Game.shoot(); Input.shoot = false; }
  if (Input.reload) { Game.reload(); Input.reload = false; }
  Game.updateBullets();

  if (Player.isDead()) { Game.loseLife(); return; }
  if (Player.hasWon()) {
    Game.mode = "won";
    if (Game.levelNumber + 1 < Level.levels.length) {
      Game.showMessage("Level complete! Press N or click Next Level.");
      Game.setNextLevelButton(true);
    } else {
      Game.showMessage("You made it. Press R to play again.");
    }
  }
};

Game.loop = function () {
  Game.update();
  Draw.updateCamera();
  Draw.everything();
  window.requestAnimationFrame(Game.loop);
};
