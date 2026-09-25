Level.loadData = function (whenDone) {
  if (window.location.protocol === "file:") {
    document.getElementById("message").textContent =
      "This game must be served from a local web server. Run: python3 -m http.server 8000, then open http://localhost:8000/";
    console.error("Local file protocol is not supported for fetch() in this game.");
    return;
  }

  fetch("data/pieces.json")
    .then(function (r) { return r.json(); })
    .then(function (piecesFile) {
      Level.pieces = piecesFile;
      return fetch("data/levels.json");
    })
    .then(function (r) { return r.json(); })
    .then(function (levelsFile) {
      Level.levels = levelsFile.levels;
      whenDone();
    })
    .catch(function (error) {
      document.getElementById("message").textContent =
        "Could not load the level files. Check data/pieces.json and data/levels.json.";
      console.error(error);
    });
};
