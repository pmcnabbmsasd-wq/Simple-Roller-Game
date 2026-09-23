/* =====================================================================
   game.js  --  THE RULES AND THE LOOP.

   The game is always in exactly ONE mode: "playing", "dead", or "won".
   Which mode it is in decides what happens each frame.

   The loop runs about 60 times a second, forever. Every time it runs it
   does the same two things: UPDATE (change the numbers) and DRAW (show
   the numbers).
   ===================================================================== */

var Game = {
  mode: "playing",   // "playing", "dead", or "won"
  levelNumber: 0,
  lives: CONFIG.STARTING_LIVES,
  secretLifeAwarded: false
};

Game.startLevel = function (levelNumber) {
  Game.levelNumber = levelNumber;
  Game.lives = CONFIG.STARTING_LIVES;
  Game.secretLifeAwarded = false;
  Level.build(levelNumber);
  Player.reset();
  Game.mode = "playing";
  Game.showLives();
  Game.showMessage("");
};

Game.showMessage = function (text) {
  document.getElementById("message").textContent = text;
};

Game.showLives = function () {
  document.getElementById("lives").textContent = "Lives: " + Game.lives;
};

// Use one life and return the player to the start of the level. The level
// stays intact, so losing a life is a checkpoint-free retry rather than a
// full restart.
Game.loseLife = function () {
  Game.lives = Game.lives - 1;
  Game.showLives();

  if (Game.lives <= 0) {
    Game.mode = "dead";
    Game.showMessage("Game over. Press R to try again.");
    return;
  }

  Player.reset();
  Game.showMessage("You lost a life. " + Game.lives + " remaining.");
};

Game.checkSecretLife = function () {
  if (Game.secretLifeAwarded) { return; }

  if (Collide.hitsLifeBonus(Player.x, Player.y, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE)) {
    Game.lives = Game.lives + 1;
    Game.secretLifeAwarded = true;
    Game.showLives();
    Game.showMessage("Secret room! You earned an extra life.");
  }
};

// --- ONE FRAME --------------------------------------------------------
Game.update = function () {

  // R always restarts, no matter what mode we are in.
  if (Input.restart) {
    Game.startLevel(Game.levelNumber);
    return;
  }

  // If we are not playing, nothing moves. We just wait for R.
  if (Game.mode !== "playing") { return; }

  Player.update();
  Game.checkSecretLife();

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

// --- THE LOOP ITSELF --------------------------------------------------
Game.loop = function () {
  Game.update();
  Draw.updateCamera();
  Draw.everything();
  window.requestAnimationFrame(Game.loop);
};
