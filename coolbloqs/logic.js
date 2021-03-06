//****************************************
// Definig the board object constructor
//****************************************

function CoolBloqs(/*width, length*/) {
  var that = this;

  var width = 20; // remove when w and l are not fixed anymore
  var length = 20;
  this.boardsize = {
    width: width,
    length: length
  };

  this.availableColors = ["#084C61", "#56A3A6", "#F7B801", "#DB504A"]; // Possible tiles colors (1st iteration has 4 fixed colors)

  this.maxTurns = Math.floor((this.boardsize.length * this.availableColors.length) / 5);
  this.countTurns = 0;

  //****************************************
  // Generating a board filled with random tiles
  //****************************************

  this.board = new Array(that.boardsize.length).fill(null).map(function(_, i) {
    // _ is for element that is not specified (here null)
    return new Array(that.boardsize.width).fill(null).map(function(_, j) {
      var tile = {
        ownership: null,
        color: that.randomTileColor(),
        row: i,
        col: j
      };
      return tile;
    });
  });

  //****************************************
  // Setting Players' starting tiles
  //****************************************

  this.board[0][0].ownership = 0; // player 1 starts on top left
  this.board[that.boardsize.length - 1][that.boardsize.width - 1].ownership = 1; // player 2 starts on bottom right

  //****************************************
  // Setting player's starting colors and zones w/ contamination, and setting player 1's turn
  //****************************************

  this.currentColor = [
    this.board[0][0].color,
    this.board[that.boardsize.length - 1][that.boardsize.width - 1].color
  ];

  this.twoPlayers = 0; // Setting 1 or 2 players. 0 = 1 player, 1 = 2 players.

  this.currentPlayer = 0; // Turn based 1v1 game. Starts with Player 1 turn (value 0), changes to (value 1) for Player 2 and back to 0, handled in the play() function.

  this.victory = null;

  // Auto-contaminate player's starting zones (useful if starting zone is > 1 tile)

  this.contaminate(this.board[0][0]); // no need to specify ownership because tile already has the info
  this.contaminate(this.board[that.boardsize.length - 1][that.boardsize.width - 1]);
  this.checkingOwnedTiles();

} // end of object creator

//****************************************
// Game Logic and Funtions go here
//****************************************

// 1. Picking a random tile color

CoolBloqs.prototype.randomTileColor = function() {
  var index = Math.floor(Math.random() * this.availableColors.length);
  var tileColor = this.availableColors[index];
  return tileColor;
};

// 2. Simplifying method to select a tile

CoolBloqs.prototype.get = function(i, j) {
  if (!this.board[i] || !this.board[i][j]) {
    return undefined;
  }
  return this.board[i][j];
};

// 3. Getting neighboors

CoolBloqs.prototype.getNeighboors = function(cell) {
  var neighboors = [];
  var upNeighboor = this.get(cell.row - 1, cell.col);
  var rightNeighboor = this.get(cell.row, cell.col + 1);
  var downNeighboor = this.get(cell.row + 1, cell.col);
  var leftNeighboor = this.get(cell.row, cell.col - 1);
  neighboors.push(upNeighboor, rightNeighboor, downNeighboor, leftNeighboor);
  return neighboors.filter(function(neighboor) {
    return neighboor !== undefined;
  });
};

//****************************************
// Contaminate function
//****************************************

CoolBloqs.prototype.contaminate = function(cell) {
  var that = this;
  var neighboors = this.getNeighboors(cell);
  var processingNeighboors = neighboors.filter(function(neighboor) {
    return (
      neighboor.ownership !== cell.ownership && neighboor.color === cell.color
    );
  });
  processingNeighboors.forEach(function(neighboor) {
    neighboor.ownership = cell.ownership;
  });
  processingNeighboors.forEach(function(neighboor) {
    that.contaminate(neighboor);
  });
};

//****************************************
// Play function
//****************************************

CoolBloqs.prototype.play = function(color) {
  if (!this.legalColors().includes(color)) {
    return;
  }

  this.currentColor[this.currentPlayer] = color;

  var that = this;

  this.currentOwnedTiles.forEach(function(cell) {
    cell.color = that.currentColor[that.currentPlayer];
  });

  this.currentOwnedTiles.forEach(function(cell) {
    that.contaminate(cell);
  });

  that.checkEnd();

  if (this.twoPlayers === 0) {
    this.currentPlayer = 0;
    this.countTurns++;
  } else {
    if (this.currentPlayer === 0) {
      this.currentPlayer = 1;
    } else {
      this.currentPlayer = 0;
    }
  }
  this.checkingOwnedTiles();
};

CoolBloqs.prototype.checkEnd = function() {
  if (this.get(0, 0).ownership === 1) {
    this.victory = 1;
  } else if (this.get(this.boardsize.length - 1, this.boardsize.width - 1).ownership === 0) {
    this.victory = 0;
  } else this.victory = null;
};

//****************************************
// Prevent playing a useless color
//****************************************

CoolBloqs.prototype.checkingOwnedTiles = function () {
  this.currentOwnedTiles = this.board
    .map(row => row.filter(cell => cell.ownership === this.currentPlayer))
    .reduce((a, b) => a.concat(b), []);
};


CoolBloqs.prototype.legalColors = function () {
  var colors = {};
  this.availableColors.forEach(color => colors[color] = false);
  this.currentOwnedTiles.forEach(cell => this.getNeighboors(cell).forEach(neighboor => colors[neighboor.color] = true));
  colors[this.currentColor[this.currentPlayer]] = false;
  return this.availableColors.filter(color => colors[color]);
};
