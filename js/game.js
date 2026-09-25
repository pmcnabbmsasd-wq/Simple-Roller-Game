var Game = {
  mode: "playing",
  levelNumber: 0,
  lives: CONFIG.STARTING_LIVES,
  laserGunCollected: false,
  bullets: [],
  dragons: [],
  fireballs: [],
  goombas: [],
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
  Game.fireballs = [];
  Game.goombas = [];
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
