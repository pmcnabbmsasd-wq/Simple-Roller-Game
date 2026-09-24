var Collide = {};

Collide.squaresUnder = function (x, y, width, height) {
  var firstCol = Math.floor(x / CONFIG.TILE);
  var lastCol = Math.floor((x + width - 1) / CONFIG.TILE);
  var firstRow = Math.floor(y / CONFIG.TILE);
  var lastRow = Math.floor((y + height - 1) / CONFIG.TILE);
  var squares = [];
  for (var row = firstRow; row <= lastRow; row++) {
    for (var col = firstCol; col <= lastCol; col++) {
      squares.push({ col: col, row: row });
    }
  }
  return squares;
};

Collide.hitsSolid = function (x, y, width, height) {
  var squares = Collide.squaresUnder(x, y, width, height);
  for (var i = 0; i < squares.length; i++) {
    if (Level.isSolid(squares[i].col, squares[i].row)) { return true; }
  }
  return false;
};

Collide.hitsSpike = function (x, y, width, height) {
  var squares = Collide.squaresUnder(x, y, width, height);
  for (var i = 0; i < squares.length; i++) {
    var col = squares[i].col;
    var row = squares[i].row;
    if (!Level.isSpike(col, row)) { continue; }
    var tileLeft = col * CONFIG.TILE;
    var tileTop = row * CONFIG.TILE;
    var hitLeft = tileLeft + 6;
    var hitTop = tileTop + 8;
    var hitRight = tileLeft + CONFIG.TILE - 6;
    var hitBottom = tileTop + CONFIG.TILE - 4;
    if (Math.min(x + width, hitRight) > Math.max(x, hitLeft) &&
        Math.min(y + height, hitBottom) > Math.max(y, hitTop)) { return true; }
  }
  return false;
};

Collide.hitsFinish = function (x, y, width, height) {
  var squares = Collide.squaresUnder(x, y, width, height);
  for (var i = 0; i < squares.length; i++) {
    if (Level.isFinish(squares[i].col, squares[i].row)) { return true; }
  }
  return false;
};

Collide.hitsLaserGun = function (x, y, width, height) {
  var squares = Collide.squaresUnder(x, y, width, height);
  for (var i = 0; i < squares.length; i++) {
    if (Level.isLaserGun(squares[i].col, squares[i].row)) { return true; }
  }
  return false;
};

Collide.overlaps = function (aX, aY, aW, aH, bX, bY, bW, bH) {
  return aX < bX + bW && aX + aW > bX &&
         aY < bY + bH && aY + aH > bY;
};
