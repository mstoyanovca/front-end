angular.module('app', []).controller('MyController', ['$scope', '$timeout', function($scope, $timeout) {
  
  var moves;       // the number of the moves played
  var scores = [];
  var states = [];
  var score;       // function
  var checkState;  // function
  $scope.yourMark;
  $scope.singlePlayer;
  $scope.yourScore;
  $scope.player2Score;
  $scope.playMode;     // disables the dropdown menu
  $scope.boardLocked;  // does not accept clicks
  $scope.gameOver;
  $scope.yourTurn;
  // game board cells:
  $scope.cell = [];
  // their style:
  $scope.cellClass = [];

  // FUNCTIONS READING THE UI CONTROLS:
  $scope.chooseMark = function(mark) {
    $scope.yourMark = mark;
    // the "X" player moves always first:
    $scope.yourMark === "X" ? $scope.yourTurn = true : $scope.yourTurn = false;
  };

  $scope.chooseMode = function(singlePlayer) {
    $scope.singlePlayer = singlePlayer;
  };

  $scope.play = function() {
    // disable the dropdown menu:
    $scope.playMode = true;
    for(var i = 0; i < 3; i++) {
      for(var j = 0; j < 3; j++) {
        $scope.cellClass[i][j] = "cell + cell-clickable";
      }
    }
    if(!$scope.singlePlayer) {
      $scope.boardLocked = false;
    } else {
      if($scope.yourTurn) {
        $scope.boardLocked = false;
      } else {
        // enable the board:
        $scope.boardLocked = true;
        // allow the "Computer's turn:" animation to display:
        $timeout(function() {
          move();
        }, 500);
      }
    }
  };

  $scope.reset = function() {
    $scope.yourMark = "X";
    $scope.yourTurn = true;
    $scope.singlePlayer = true;
    $scope.yourScore = 0;
    $scope.player2Score = 0;
    // enable the dropwdown menu:
    $scope.playMode = false;
    // disable the board:
    $scope.boardLocked = true;
    $scope.gameOver = false;
    moves = 0;
    // clear content:
    for(var i = 0; i < 3; i++) {
      $scope.cell[i] = [];
      for(var j = 0; j < 3; j++) {
        $scope.cell[i][j] = 0;
      }
    }
    // clear style:
    for(var i = 0; i < 3; i++) {
      $scope.cellClass[i] = [];
      for(var j = 0; j < 3; j++) {
        $scope.cellClass[i][j] = "cell";
      }
    }
  };
  
  // initialize on load:
  $scope.reset();

  // mark a cell on a click:
  $scope.mark = function(i, j) {
    if ($scope.boardLocked) return;
    // find the current player:
    var player;
    $scope.yourTurn ? player = 1 : player = 2;
    // do not mark an already taken cell:
    if($scope.cell[i][j] === 0) {
      $scope.cell[i][j] = player;
    } else {
      return;
    }
    if($scope.singlePlayer) $scope.boardLocked = true;
    $scope.cellClass[i][j] = "cell";
    moves++;
    if(score()) return;
    // if it is not a win or a draw, keep playing:
    $scope.yourTurn = !$scope.yourTurn;
    if($scope.singlePlayer && !$scope.yourTurn) {
      $timeout(function() {
        move();
      }, 500);
    }
  };  // end of mark()

  // BUSSINES LOGIC FUNCTIONS:
  score = function() {
    var win = checkState($scope.cell, true);
    if(win !== -1) {
      // don't accept any more clicks:
      $scope.boardLocked = true;
      $scope.gameOver = true;
      switch(win) {
        case 1:    
          // retain $scope.yourTurn; whoever won, plays first next game;
          $scope.yourScore++;
          break;
        case 2:
          $scope.player2Score++;
          break;
        case 0:
          // the players take turns after a draw:
          $scope.yourTurn = !$scope.yourTurn;
          break;
      }
      $timeout(function() {
        newGame();
      }, 3000);
      return true;
    }
    return false;
  };
  
  // check for a win or a draw:
  checkState = function(state, highlight) {
    // state: an array of game board cells values;
    // highlight: enable highlighting the winnig row/column/diagonal;
    var boardFull = true;
    // rows:
    for(var i = 0; i < 3; i++) {
      var row = state[i][0] * state[i][1] * state[i][2];
      if(row === 0) boardFull = false;
      if((row === 1 || row === 8) && highlight) {
        for(var j = 0; j < 3; j++) {
          $scope.cellClass[i][j] = "cell + cell-highlight";
        }
      }
      switch(row) {
          case 1:
            // player 1 (you) won:
            return 1;
          case 8:
            // player 2 (in single player mode the computer) won:
            return 2;
      }
    }
    // columns:
    for(var i = 0; i < 3; i++) {
      var column = state[0][i] * state[1][i] * state[2][i];
      if(column === 0) boardFull = false;
      if((column === 1 || column === 8) && highlight) {
        for(var j = 0; j < 3; j++) {
          $scope.cellClass[j][i] = "cell + cell-highlight";
        }
      }
      switch(column) {
        case 1:
          return 1;
        case 8:
          return 2;
      }
    }
    // diagonals:
    var diagonal = state[0][0] * state[1][1] * state[2][2];
    if(diagonal === 0) boardFull = false;
    if((diagonal === 1 || diagonal === 8) && highlight) {
      for(var i = 0; i < 3; i++) {
        $scope.cellClass[i][i] = "cell + cell-highlight";
      }
    }
    switch(diagonal) {
      case 1:
        return 1;
      case 8:
        return 2;
        break;
    }
    diagonal = state[2][0] * state[1][1] * state[0][2];
    if(diagonal === 0) boardFull = false;
    if((diagonal === 1 || diagonal === 8) && highlight) {
      for(var i = 0; i < 3; i++) {
        $scope.cellClass[2 - i][i] = "cell + cell-highlight";
      }
    }
    switch(diagonal) {
      case 1:
        return 1;
      case 8:
        return 2;
    }
    // draw:
    if(boardFull && highlight) {
      for(var i = 0; i < 3; i++) {
        for(var j =0; j < 3; j++) {
          $scope.cellClass[i][j] = "cell + cell-highlight";
        }
      }
    }
    if(boardFull) return 0;
    // the game is still on:
    return -1;
  };  // end of checkState()

  // reset for a new game:
  var newGame = function() {
    moves = 0;
    $scope.gameOver = false;
    // clear content:
    for(var i = 0; i < 3; i++) {
      for(var j = 0; j < 3; j++) {
        $scope.cell[i][j] = 0;
      }
    }
    // clear style:
    for(var i = 0; i < 3; i++) {
      for(var j = 0; j < 3; j++) {
        $scope.cellClass[i][j] = "cell + cell-clickable";
      }
    }
    if(!$scope.singlePlayer) {
      $scope.boardLocked = false;
    } else {
      if($scope.yourTurn) {
        $scope.boardLocked = false;
      } else {
        $scope.boardLocked = true;
        $timeout(function() {
          move();
        }, 500);
      }
    }
  };
  
  // the minimax algorithm:
  var minimax = function(cell, turn) {
    var win = checkState(cell, false);
    if(win !== -1) {
      switch(win) {
        case 1:  // player 1 (you) wins
          return [moves - 10, cell];
        case 2:  // player 2 (computer) wins
          return [10 - moves, cell];
        case 0:  // draw
          return [0, cell];
      }
    }
    var state = [];
    var score = -11;
    for(var i = 0; i < 3; i++) {
      for(var j = 0; j < 3; j++) {
        if(cell[i][j] === 0) {
          var mark;
          turn ? mark = 1 : mark = 2;
          cell[i][j] = mark;
          moves++;
          var currentScore = minimax(cell, !turn)[0];
          // add "=", to be able to push all winning states,
          // not only the first one:
          if(!turn && currentScore >= score ||
             turn && currentScore < score ||
             score === -11) {
            score = currentScore;
            // deep clone:
            state = cell.map(function(elm) {return elm.slice();});
            // preserve the nodes for later processing:
            scores.push(currentScore);
            states.push(state);
          }
          cell[i][j] = 0;
          moves--;
        }
      }
    }
    return [score, state];
  };
  
  // selects one of the possible good moves for variety:
  var chooseMove = function(maxScore) {
    var maxScoreMoves = [];
    for(var i = 0; i < scores.length; i++) {
      if(scores[i] === maxScore) {
        maxScoreMoves.push(states[i]);
      }
    }
    /* create an array of states with  (9 - moves) empty cells
    left; those are ALL good candidates for a next move, not
    only the first/last one, that minimax would normally return;
    gives the game more humane behaviour; */
    var bestMoves = [];
    for(var k = 0; k < maxScoreMoves.length; k++) {
      var n = 0;
      for(var i = 0; i < 3; i++) {
        for(var j = 0; j < 3; j++) {
          if(maxScoreMoves[k][i][j] !== 0) n++;
        }
      }
      if(n === moves) bestMoves.push(maxScoreMoves[k]);
    }
    // pick randomly one of them:
    var index = Math.floor(Math.random() * bestMoves.length);
    $scope.cell = bestMoves[index];
    // make the newly clicked cell unclickable:
    for(var i = 0; i < 3; i++) {
      for(var j = 0; j < 3; j++) {
        if($scope.cell[i][j] !== 0) $scope.cellClass[i][j] = "cell";
      }
    }
  };
  
  var move = function() {
    // no first move looses, just mark a random cell; skip minimax
    // for the first move, which is the slowest, especially on smaller
    // devices (or decrease depth):
    if(moves === 0) {
      moves++;
      var i = Math.floor(Math.random() * 3);
      var j = Math.floor(Math.random() * 3);
      $scope.cell[i][j] = 2;
      $scope.cellClass[i][j] = "cell";
      $scope.yourTurn = !$scope.yourTurn;
      $scope.boardLocked = false;
      return;
    }
    states = [];
    scores = [];
    var maxScore = minimax($scope.cell, $scope.yourTurn)[0];
    moves++;
    chooseMove(maxScore);
    if(score()) return;
    $scope.yourTurn = !$scope.yourTurn;
    $scope.boardLocked = false;
    return;
  };

}]);