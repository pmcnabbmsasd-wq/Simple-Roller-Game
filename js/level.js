var Level = {
  pieces: null,
  levels: null,
  grid: [],
  cols: 0,
  name: "",
  startX: 0,
  startY: 0
};

Level.loadData = function (whenDone) {
  var useEmbeddedData = function () {
    if (window.ROLLER_DATA && window.ROLLER_DATA.pieces && window.ROLLER_DATA.levels) {
      Level.pieces = window.ROLLER_DATA.pieces;
      Level.levels = window.ROLLER_DATA.levels;
      if (whenDone) { whenDone(); }
      return true;
    }
    return false;
  };

  if (useEmbeddedData()) { return; }

  var baseUrl = "";
  if (window.location.protocol === "file:") {
    baseUrl = "http://localhost:8000/";
  }

  fetch(baseUrl + "data/pieces.json")
    .then(function (r) { return r.json(); })
    .then(function (piecesFile) {
      Level.pieces = piecesFile;
      return fetch(baseUrl + "data/levels.json");
    })
    .then(function (r) { return r.json(); })
    .then(function (levelsFile) {
      Level.levels = levelsFile.levels;
      if (whenDone) { whenDone(); }
    })
    .catch(function (error) {
      if (!useEmbeddedData()) {
        if (window.location.protocol === "file:") {
          document.getElementById("message").textContent =
            "This game must be served from a local web server. Run: python3 -m http.server 8000, then open http://localhost:8000/";
        } else {
          document.getElementById("message").textContent =
            "Could not load the level files. Check data/pieces.json and data/levels.json.";
        }
        console.error(error);
      }
    });
};

Level.build = function (levelNumber) {
  var level = Level.levels[levelNumber];
  if (!level) {
    console.error("No level at index " + levelNumber);
    return;
  }

  Level.name = level.name;
  Level.grid = [];
  Level.cols = level.pieces.length * CONFIG.PIECE_COLS;

  for (var row = 0; row < CONFIG.ROWS; row++) {
    Level.grid.push("");
  }

  for (var p = 0; p < level.pieces.length; p++) {
    var pieceName = level.pieces[p];
    var piece = Level.pieces[pieceName];

    if (!piece) {
      console.error("No piece named '" + pieceName + "' in data/pieces.json");
      piece = Level.pieces.flat;
    }

    for (var row = 0; row < CONFIG.ROWS; row++) {
      Level.grid[row] = Level.grid[row] + piece[row];
    }
  }

  Level.findStart();
};

Level.findStart = function () {
  for (var row = 0; row < CONFIG.ROWS; row++) {
    for (var col = 0; col < Level.cols; col++) {
      if (Level.charAt(col, row) === "S") {
        Level.startX = col * CONFIG.TILE;
        Level.startY = row * CONFIG.TILE;
        return;
      }
    }
  }

  Level.startX = 0;
  Level.startY = 0;
};

Level.charAt = function (col, row) {
  if (row < 0 || row >= CONFIG.ROWS) { return "."; }
  if (col < 0 || col >= Level.cols) { return "."; }
  return Level.grid[row].charAt(col);
};

Level.isSolid = function (col, row) { return Level.charAt(col, row) === "#"; };
Level.isSpike = function (col, row) { return Level.charAt(col, row) === "^"; };
Level.isFinish = function (col, row) { return Level.charAt(col, row) === "F"; };
Level.isGun = function (col, row) { return Level.charAt(col, row) === "G"; };
Level.pixelWidth = function () { return Level.cols * CONFIG.TILE; };
