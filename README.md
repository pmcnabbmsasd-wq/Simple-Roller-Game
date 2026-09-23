/* =====================================================================
   draw.js  --  EVERYTHING YOU CAN SEE.

   Nothing in this file changes the game. It only puts pixels on screen.
   If you want to change how the game LOOKS, this is the only file you
   need. If you want to change how it BEHAVES, this is the wrong file.

   The whole game is black and white on purpose. That is your room to
   work in.
   ===================================================================== */

var Draw = {
  canvas: null,
  ctx: null,
  cameraX: 0     // how far the view has scrolled to the right
};

Draw.setup = function () {
  Draw.canvas = document.getElementById("game");
  Draw.ctx = Draw.canvas.getContext("2d");
};

// Follow the player, but never scroll past the ends of the level.
Draw.updateCamera = function () {
  Draw.cameraX = Player.x - CONFIG.CANVAS_W / 2;
  if (Draw.cameraX < 0) { Draw.cameraX = 0; }

  var furthest = Level.pixelWidth() - CONFIG.CANVAS_W;
  if (furthest < 0) { furthest = 0; }
  if (Draw.cameraX > furthest) { Draw.cameraX = furthest; }
};

// Draw one whole frame.
Draw.everything = function () {
  var ctx = Draw.ctx;

  // Retro sky backdrop.
  ctx.fillStyle = "#8ad6ff";
  ctx.fillRect(0, 0, CONFIG.CANVAS_W, CONFIG.CANVAS_H);

  // Sun.
  ctx.fillStyle = "#ffd96c";
  ctx.beginPath();
  ctx.arc(700, 60, 28, 0, Math.PI * 2);
  ctx.fill();

  // Clouds.
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  for (var i = 0; i < 5; i++) {
    var cloudX = 60 + i * 150 - (Draw.cameraX * 0.15);
    var cloudY = 50 + (i % 2) * 24;
    ctx.beginPath();
    ctx.arc(cloudX, cloudY, 18, 0, Math.PI * 2);
    ctx.arc(cloudX + 18, cloudY - 8, 18, 0, Math.PI * 2);
    ctx.arc(cloudX + 36, cloudY, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.save();
  ctx.translate(-Draw.cameraX, 0);
  Draw.world();
  Draw.player();
  ctx.restore();
};

// Draw every grid square that is currently on screen.
Draw.world = function () {
  var ctx = Draw.ctx;
  var size = CONFIG.TILE;

  var firstCol = Math.floor(Draw.cameraX / size) - 1;
  var lastCol  = firstCol + Math.ceil(CONFIG.CANVAS_W / size) + 2;

  for (var row = 0; row < CONFIG.ROWS; row++) {
    for (var col = firstCol; col <= lastCol; col++) {
      var here = Level.charAt(col, row);
      var x = col * size;
      var y = row * size;

      if (here === "#") { Draw.block(x, y, size); }
      if (here === "^") { Draw.spike(x, y, size); }
      if (here === "F") { Draw.finish(x, y, size); }
      if (here === "L") { Draw.lifeBonus(x, y, size); }
    }
  }
};

// Retro brick block.
Draw.block = function (x, y, size) {
  var ctx = Draw.ctx;
  ctx.fillStyle = "#d99a4d";
  ctx.fillRect(x, y, size, size);

  ctx.fillStyle = "#f4c07a";
  ctx.fillRect(x + 2, y + 2, size - 4, 6);
  ctx.fillRect(x + 2, y + 2, 6, size - 4);

  ctx.strokeStyle = "#7f3d1d";
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, size - 2, size - 2);

  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.beginPath();
  ctx.moveTo(x + 3, y + 3);
  ctx.lineTo(x + size - 3, y + 3);
  ctx.stroke();
};

// Spike: classic castle hazard.
Draw.spike = function (x, y, size) {
  var ctx = Draw.ctx;
  ctx.fillStyle = "#5b8e4d";
  ctx.beginPath();
  ctx.moveTo(x, y + size);
  ctx.lineTo(x + size / 2, y + 4);
  ctx.lineTo(x + size, y + size);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#83b672";
  ctx.beginPath();
  ctx.moveTo(x + 2, y + size);
  ctx.lineTo(x + size / 2, y + 8);
  ctx.lineTo(x + size - 2, y + size);
  ctx.closePath();
  ctx.fill();
};

// Finish flag pole.
Draw.finish = function (x, y, size) {
  var ctx = Draw.ctx;
  ctx.fillStyle = "#3d2515";
  ctx.fillRect(x + size / 2 - 2, y, 4, size);

  ctx.fillStyle = "#d93d2e";
  ctx.beginPath();
  ctx.moveTo(x + size / 2 + 2, y + 4);
  ctx.lineTo(x + size - 4, y + 12);
  ctx.lineTo(x + size / 2 + 2, y + 22);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#fff7d6";
  ctx.fillRect(x + size / 2 - 6, y + 6, 3, 8);
};

// Secret bonus token.
Draw.lifeBonus = function (x, y, size) {
  var ctx = Draw.ctx;
  var cx = x + size / 2;
  var cy = y + size / 2;

  ctx.fillStyle = "#f7d64f";
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.18, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#d08a00";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.18, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#fff5c3";
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.08, 0, Math.PI * 2);
  ctx.fill();
};

// Retro player: red cap, blue body, white face.
Draw.player = function () {
  var ctx = Draw.ctx;
  var r = CONFIG.PLAYER_RADIUS;
  var centerX = Player.x + CONFIG.PLAYER_SIZE / 2;
  var centerY = Player.y + CONFIG.PLAYER_SIZE / 2;

  // cap
  ctx.fillStyle = "#d93d2e";
  ctx.fillRect(centerX - r, centerY - r - 6, r * 2, 8);
  ctx.fillRect(centerX - 8, centerY - r - 12, 16, 8);

  // face/body
  ctx.fillStyle = "#f8d4b0";
  ctx.beginPath();
  ctx.arc(centerX, centerY - 2, r - 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#1e5bbd";
  ctx.fillRect(centerX - r + 3, centerY + 7, (r * 2) - 6, r - 2);

  // overalls details
  ctx.fillStyle = "#e8f0ff";
  ctx.fillRect(centerX - 10, centerY + 10, 8, 10);
  ctx.fillRect(centerX + 2, centerY + 10, 8, 10);

  // eyes and smile
  ctx.fillStyle = "#000000";
  ctx.fillRect(centerX - 7, centerY - 3, 3, 3);
  ctx.fillRect(centerX + 4, centerY - 3, 3, 3);
  ctx.beginPath();
  ctx.arc(centerX, centerY + 2, 4, 0, Math.PI);
  ctx.stroke();

  // moustache dot
  ctx.fillStyle = "#2d1e18";
  ctx.fillRect(centerX - 5, centerY + 5, 10, 2);

  // rolled dot
  ctx.fillStyle = "#000000";
  var dotX = centerX + Math.cos(Player.angle) * r * CONFIG.DOT_DISTANCE;
  var dotY = centerY + Math.sin(Player.angle) * r * CONFIG.DOT_DISTANCE;
  ctx.beginPath();
  ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
  ctx.fill();
};
