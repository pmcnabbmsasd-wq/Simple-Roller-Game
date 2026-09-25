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
