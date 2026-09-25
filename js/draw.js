var Draw = {
  canvas: null,
  ctx: null,
  cameraX: 0
};

Draw.setup = function () {
  Draw.canvas = document.getElementById("game");
  Draw.ctx = Draw.canvas.getContext("2d");
};

Draw.updateCamera = function () {
  Draw.cameraX = Player.x - CONFIG.CANVAS_W / 2;
  if (Draw.cameraX < 0) { Draw.cameraX = 0; }
  var furthest = Level.pixelWidth() - CONFIG.CANVAS_W;
  if (furthest < 0) { furthest = 0; }
  if (Draw.cameraX > furthest) { Draw.cameraX = furthest; }
};

Draw.everything = function () {
  var ctx = Draw.ctx;
  ctx.fillStyle = "#8bd6ff";
  ctx.fillRect(0, 0, CONFIG.CANVAS_W, CONFIG.CANVAS_H);

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

  ctx.fillStyle = "#ffe36a";
  ctx.beginPath();
  ctx.arc(680, 70, 30, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(-Draw.cameraX, 0);
  Draw.world();
  Draw.bullets();
  Draw.dragons();
  Draw.fireballs();
  Draw.goombas();
  Draw.player();
  ctx.restore();
};

Draw.world = function () {
  var size = CONFIG.TILE;
  var firstCol = Math.floor(Draw.cameraX / size) - 1;
  var lastCol = firstCol + Math.ceil(CONFIG.CANVAS_W / size) + 2;
  for (var row = 0; row < CONFIG.ROWS; row++) {
    for (var col = firstCol; col <= lastCol; col++) {
      var here = Level.charAt(col, row);
      var x = col * size;
      var y = row * size;
      if (here === "#") { Draw.block(x, y, size); }
      if (here === "^") { Draw.spike(x, y, size); }
      if (here === "F") { Draw.finish(x, y, size); }
      if (here === "G" && !Game.laserGunCollected) { Draw.laserGun(x, y, size); }
    }
  }
};

Draw.block = function (x, y, size) {
  var ctx = Draw.ctx;
  ctx.fillStyle = "#d78b40"; ctx.fillRect(x, y, size, size);
  ctx.fillStyle = "#f3c77f"; ctx.fillRect(x + 2, y + 2, size - 4, 5); ctx.fillRect(x + 2, y + 2, 5, size - 4);
  ctx.fillStyle = "#b95f2d"; ctx.fillRect(x, y + size - 3, size, 3); ctx.fillRect(x + size - 3, y, 3, size);
  ctx.strokeStyle = "#6f3d1d"; ctx.lineWidth = 2; ctx.strokeRect(x + 1, y + 1, size - 2, size - 2);
};

Draw.spike = function (x, y, size) {
  var ctx = Draw.ctx;
  ctx.fillStyle = "#4c9d49"; ctx.beginPath(); ctx.moveTo(x, y + size); ctx.lineTo(x + size / 2, y + 4); ctx.lineTo(x + size, y + size); ctx.closePath(); ctx.fill();
};

Draw.finish = function (x, y, size) {
  var ctx = Draw.ctx;
  ctx.fillStyle = "#4d3219"; ctx.fillRect(x + size / 2 - 2, y, 4, size);
  ctx.fillStyle = "#dd3d2d"; ctx.beginPath(); ctx.moveTo(x + size / 2 + 2, y + 4); ctx.lineTo(x + size - 4, y + 12); ctx.lineTo(x + size / 2 + 2, y + 20); ctx.closePath(); ctx.fill();
};

Draw.laserGun = function (x, y, size) {
  var ctx = Draw.ctx;
  ctx.fillStyle = "#555"; ctx.fillRect(x + 8, y + 15, 25, 8);
  ctx.fillStyle = "#d33"; ctx.fillRect(x + 27, y + 12, 9, 5);
  ctx.fillStyle = "#222"; ctx.fillRect(x + 12, y + 23, 8, 10);
  ctx.strokeStyle = "#ffeb3b"; ctx.strokeRect(x + 5, y + 11, 31, 23);
};

Draw.bullets = function () {
  var ctx = Draw.ctx;
  ctx.fillStyle = "#fff200";
  for (var i = 0; i < Game.bullets.length; i++) {
    ctx.fillRect(Game.bullets[i].x, Game.bullets[i].y, 10, 4);
  }
};

Draw.dragons = function () {
  var ctx = Draw.ctx;
  for (var i = 0; i < Game.dragons.length; i++) {
    var dragon = Game.dragons[i];
    if (!dragon.alive) { continue; }
    var x = dragon.x;
    var y = dragon.y;
    ctx.fillStyle = "#8b3fb0";
    ctx.beginPath();
    ctx.moveTo(x + 4, y + 18); ctx.lineTo(x - 12, y + 4); ctx.lineTo(x + 2, y + 25);
    ctx.moveTo(x + 26, y + 18); ctx.lineTo(x + 42, y + 4); ctx.lineTo(x + 28, y + 25);
    ctx.fill();
    ctx.fillStyle = "#c14b44";
    ctx.fillRect(x + 5, y + 8, 22, 18);
    ctx.fillStyle = "#f6d34a";
    ctx.fillRect(x + 9, y + 13, 4, 4); ctx.fillRect(x + 19, y + 13, 4, 4);
    ctx.fillStyle = "#e66b2e";
    ctx.fillRect(x + 12, y + 25, 8, 5);
  }
};

Draw.fireballs = function () {
  if (!Game.fireballs) { return; }
  var ctx = Draw.ctx;
  ctx.fillStyle = "#ff7a18";
  for (var i = 0; i < Game.fireballs.length; i++) {
    var fireball = Game.fireballs[i];
    ctx.beginPath();
    ctx.arc(fireball.x, fireball.y, fireball.radius, 0, Math.PI * 2);
    ctx.fill();
  }
};

Draw.goombas = function () {
  if (!Game.goombas) { return; }
  var ctx = Draw.ctx;
  for (var i = 0; i < Game.goombas.length; i++) {
    var goomba = Game.goombas[i];
    if (!goomba.alive) { continue; }
    var x = goomba.x;
    var y = goomba.y;
    var size = goomba.size;

    ctx.fillStyle = "#8c5a2b";
    ctx.beginPath();
    ctx.ellipse(x + size / 2, y + size / 2, size / 2, size / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f3e8d2";
    ctx.fillRect(x + 4, y + 6, 4, 4);
    ctx.fillRect(x + size - 8, y + 6, 4, 4);

    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(x + 6, y + 7, 2, 2);
    ctx.fillRect(x + size - 8, y + 7, 2, 2);

    ctx.fillStyle = "#5a2d17";
    ctx.fillRect(x + 5, y + size - 8, size - 10, 5);
  }
};

Draw.player = function () {
  var ctx = Draw.ctx;
  var r = CONFIG.PLAYER_RADIUS;
  var centerX = Player.x + CONFIG.PLAYER_SIZE / 2;
  var centerY = Player.y + CONFIG.PLAYER_SIZE / 2;
  ctx.fillStyle = "#d73a2a"; ctx.fillRect(centerX - r + 3, centerY - r - 7, (r * 2) - 6, 9); ctx.fillRect(centerX - 10, centerY - r - 14, 20, 8);
  ctx.fillStyle = "#f6d1b3"; ctx.beginPath(); ctx.arc(centerX, centerY - 2, r - 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#1f5dc0"; ctx.fillRect(centerX - r + 5, centerY + 6, (r * 2) - 10, r - 3);
  ctx.fillStyle = "#000"; ctx.fillRect(centerX - 7, centerY - 3, 3, 3); ctx.fillRect(centerX + 4, centerY - 3, 3, 3);
};
