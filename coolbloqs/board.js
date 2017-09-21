//****************************************
// Game UI and Behavior on Screen goes here
//****************************************

// $(document).ready(function () {

  // jquery stuff goes here

  game = new CoolBloqs();

function display() {
  var board = game.board.map(function(row) {
    return row.map(function(cell) {
      return "ownership: " + cell.ownership + "; color: " + cell.color;
    });
  });
  console.table(board);

  var visualBoard = $(".board");

  for (row = 0; row < game.boardsize.length; row++) {
    for (col = 0; col < game.boardsize.width; col++) {
      var rowCell = row * cellSize;
      var colCell = col * cellSize;
      visualBoard.html("<div class='cell' style='top:" + rowcell + "px';'left:" + colCell + "px'></div>");
    }
  }

}

// });
