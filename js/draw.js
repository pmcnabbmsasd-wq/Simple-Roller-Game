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

  ctx.fillStyle = "#8bd6ff";
  ctx.fillRect(0, 0, CONFIG.CANVAS_W, CONFIG.CANVAS_H);

  // distant hills
  ctx.fillStyle = "#7ecb66";
  for (var i = 0; i < 6; i++) {
    var hillX = (-Draw.cameraX * 0.35) + i * 180;
    ctx.beginPath();
    ctx.moveTo(hillX, 400);
    ctx.quadraticCurveTo(hillX + 45, 270, hillX + 90, 400);
    ctx.quadraticCurveTo(hillX + 135, 300, hillX + 180, 400);
    ctx.closePath();
    ctx.fill();
  }

  // sun
  ctx.fillStyle = "#ffe36a";
  ctx.beginPath();
  ctx.arc(680, 70, 30, 0, Math.PI * 2);
  ctx.fill();

  // clouds
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  var cloudOffset = Draw.cameraX * 0.15;
  for (var c = 0; c < 5; c++) {
    var cx = 80 + c * 170 - cloudOffset % 200;
    var cy = 60 + (c % 2) * 20;
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.arc(cx + 20, cy - 10, 18, 0, Math.PI * 2);
    ctx.arc(cx + 40, cy, 18, 0, Math.PI * 2);
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

// Classic brick block.
Draw.block = function (x, y, size) {
  var ctx = Draw.ctx;

  ctx.fillStyle = "#d78b40";
  ctx.fillRect(x, y, size, size);

  ctx.fillStyle = "#f3c77f";
  ctx.fillRect(x + 2, y + 2, size - 4, 5);
  ctx.fillRect(x + 2, y + 2, 5, size - 4);

  ctx.fillStyle = "#b95f2d";
  ctx.fillRect(x, y + size - 3, size, 3);
  ctx.fillRect(x + size - 3, y, 3, size);

  ctx.strokeStyle = "#6f3d1d";
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, size - 2, size - 2);

  // subtle top highlight
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.moveTo(x + 3, y + 3);
  ctx.lineTo(x + size - 3, y + 3);
  ctx.stroke();
};

// Retro hazard spike / pit marker.
Draw.spike = function (x, y, size) {
  var ctx = Draw.ctx;

  ctx.fillStyle = "#4c9d49";
  ctx.beginPath();
  ctx.moveTo(x, y + size);
  ctx.lineTo(x + size / 2, y + 4);
  ctx.lineTo(x + size, y + size);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#74c15e";
  ctx.beginPath();
  ctx.moveTo(x + 2, y + size);
  ctx.lineTo(x + size / 2, y + 9);
  ctx.lineTo(x + size - 2, y + size);
  ctx.closePath();
  ctx.fill();
};

// Finish flag pole.
Draw.finish = function (x, y, size) {
  var ctx = Draw.ctx;

  ctx.fillStyle = "#4d3219";
  ctx.fillRect(x + size / 2 - 2, y, 4, size);

  ctx.fillStyle = "#dd3d2d";
  ctx.beginPath();
  ctx.moveTo(x + size / 2 + 2, y + 4);
  ctx.lineTo(x + size - 4, y + 12);
  ctx.lineTo(x + size / 2 + 2, y + 20);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#fbe5a6";
  ctx.fillRect(x + size / 2 - 6, y + 4, 4, 8);
};

// Bonus coin.
Draw.lifeBonus = function (x, y, size) {
  var ctx = Draw.ctx;
  var cx = x + size / 2;
  var cy = y + size / 2;

  ctx.fillStyle = "#f6d34a";
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.18, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#d08d00";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.18, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#fff3b5";
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.08, 0, Math.PI * 2);
  ctx.fill();
};

// Stylized plumber-like player.
Draw.player = function () {
  var ctx = Draw.ctx;
  var r = CONFIG.PLAYER_RADIUS;
  var centerX = Player.x + CONFIG.PLAYER_SIZE / 2;
  var centerY = Player.y + CONFIG.PLAYER_SIZE / 2;

  // cap
  ctx.fillStyle = "#d73a2a";
  ctx.fillRect(centerX - r + 3, centerY - r - 7, (r * 2) - 6, 9);
  ctx.fillRect(centerX - 10, centerY - r - 14, 20, 8);

  // face
  ctx.fillStyle = "#f6d1b3";
  ctx.beginPath();
  ctx.arc(centerX, centerY - 2, r - 4, 0, Math.PI * 2);
  ctx.fill();

  // overalls
  ctx.fillStyle = "#1f5dc0";
  ctx.fillRect(centerX - r + 5, centerY + 6, (r * 2) - 10, r - 3);

  ctx.fillStyle = "#ebf3ff";
  ctx.fillRect(centerX - 9, centerY + 8, 7, 10);
  ctx.fillRect(centerX + 2, centerY + 8, 7, 10);

  // face details
  ctx.fillStyle = "#000000";
  ctx.fillRect(centerX - 7, centerY - 3, 3, 3);
  ctx.fillRect(centerX + 4, centerY - 3, 3, 3);
  ctx.beginPath();
  ctx.arc(centerX, centerY + 2, 5, 0, Math.PI);
  ctx.stroke();

  // mustache
  ctx.fillStyle = "#2b1e17";
  ctx.fillRect(centerX - 5, centerY + 5, 10, 2);

  // dot on the rolling body
  ctx.fillStyle = "#000000";
  var dotX = centerX + Math.cos(Player.angle) * r * CONFIG.DOT_DISTANCE;
  var dotY = centerY + Math.sin(Player.angle) * r * CONFIG.DOT_DISTANCE;
  ctx.beginPath();
  ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
  ctx.fill();
};
