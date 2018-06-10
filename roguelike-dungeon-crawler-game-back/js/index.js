"use strict";

var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
// board size in cells:
var boardWidth = 80;
var boardHeight = 80;
// status bar variables:
var health = 100;
var weapons = ["stick", "brass knuckles", "serrated dagger", "katana", "reaper's scythe", "large trout"];
var weapon = weapons[0];
// tune the game here; you need 240 health points to beet the boss;
var attackValues = [7, 26, 64, 88, 200, 300]; // per dungeon/weapon
var attack = attackValues[0];
var level = 0;
// next level points:
var XP = 60; // add 60 for each level
// reward points per killed enemy:
var reward = 10; // add 10 for each level
var dungeon = 0;
var cell = []; // game board
var chambers = []; // "rooms"
var doors = [];
var cursorX = 0;
var cursorY = 0;
var damage = [7, 20, 32, 42, 58]; // per dungeon
var enemyLife = 50; // add 50 per dungeon
var bossLife = 240;
var dead = false;
var win = false;
var dark = false;

var LossModal = React.createClass({
  displayName: "LossModal",
  getInitialState: function getInitialState() {
    return { showModal: false };
  },
  close: function close() {
    this.setState({ showModal: false });
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.dead === true) {
      this.setState({ showModal: true });
    }
  },
  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        Modal,
        { show: this.state.showModal, onHide: this.close },
        React.createElement(
          Modal.Header,
          null,
          React.createElement(
            Modal.Title,
            null,
            "You died! Try again."
          )
        ),
        React.createElement(
          Modal.Footer,
          null,
          React.createElement(
            Button,
            { onClick: this.close },
            "Close"
          )
        )
      )
    );
  }
});

var WinModal = React.createClass({
  displayName: "WinModal",
  getInitialState: function getInitialState() {
    return { showModal: false };
  },
  close: function close() {
    this.setState({ showModal: false });
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.win === true) {
      this.setState({ showModal: true });
    }
  },
  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        Modal,
        { show: this.state.showModal, onHide: this.close },
        React.createElement(
          Modal.Header,
          null,
          React.createElement(
            Modal.Title,
            null,
            "You won!"
          )
        ),
        React.createElement(
          Modal.Footer,
          null,
          React.createElement(
            Button,
            { onClick: this.close },
            "Close"
          )
        )
      )
    );
  }
});

function refresh() {
    React.createElement(LossModal, { dead: dead }),
    React.createElement(WinModal, { win: win })),
    document.getElementById('container'));
}

function moveUp() {
  // don't leave the board:
  if (cursorY - 1 < 0) return;
  if (cell[cursorY - 1][cursorX].class === "cell cell-white") {
    // move up:
    moveUp();
  } else if (cell[cursorY - 1][cursorX].class === "cell cell-green") {
    // collect health:
    health += 20;
    moveUp();
  } else if (cell[cursorY - 1][cursorX].class === "cell cell-red") {
    // fight:
    if (defeat()) {
      moveUp();
    }
  } else if (cell[cursorY - 1][cursorX].class === "cell cell-yellow") {
    // change weapon:
    weapon = weapons[dungeon + 1];
    if (attack < attackValues[dungeon + 1]) attack = attackValues[dungeon + 1];
    moveUp();
  } else if (cell[cursorY - 1][cursorX].class === "cell cell-purple") {
    // change dungeon:
    dungeon++;
    enemyLife = 50 + dungeon * 50;
    moveUp();
    // create new board:
    setTimeout(function () {
      resetDungeon();
      createDungeon();
      refresh();
    }, 500);
  } else if (cell[cursorY - 1][cursorX].class === "cell cell-boss") {
    // fight the boss:
    fightBoss();
  }
  function moveUp() {
    cell[cursorY][cursorX].class = "cell cell-white";
    cursorY--;
    cell[cursorY][cursorX].class = "cell cell-blue";
    if (dark) moveDarkness();
    refresh();
  }
}

function moveRight() {
  // don't leave the board:
  if (cursorX + 1 === boardWidth) return;
  if (cell[cursorY][cursorX + 1].class === "cell cell-white") {
    // move to the right:
    moveRight();
  } else if (cell[cursorY][cursorX + 1].class === "cell cell-green") {
    // collect health:
    health += 20;
    moveRight();
  } else if (cell[cursorY][cursorX + 1].class === "cell cell-red") {
    // fight:
    if (defeat()) {
      moveRight();
    }
  } else if (cell[cursorY][cursorX + 1].class === "cell cell-yellow") {
    // change weapon:
    weapon = weapons[dungeon + 1];
    if (attack < attackValues[dungeon + 1]) attack = attackValues[dungeon + 1];
    moveRight();
  } else if (cell[cursorY][cursorX + 1].class === "cell cell-purple") {
    // change dungeon:
    dungeon++;
    enemyLife = 50 + dungeon * 50;
    moveRight();
    // create new board:
    setTimeout(function () {
      resetDungeon();
      createDungeon();
      refresh();
    }, 500);
  } else if (cell[cursorY][cursorX + 1].class === "cell cell-boss") {
    // fight the boss:
    fightBoss();
  }
  function moveRight() {
    cell[cursorY][cursorX].class = "cell cell-white";
    cursorX++;
    cell[cursorY][cursorX].class = "cell cell-blue";
    if (dark) moveDarkness();
    refresh();
  }
}

function moveDown() {
  // don't leave the board:
  if (cursorY + 1 === boardHeight) return;
  if (cell[cursorY + 1][cursorX].class === "cell cell-white") {
    // move down:
    moveDown();
  } else if (cell[cursorY + 1][cursorX].class === "cell cell-green") {
    // collect health:
    health += 20;
    moveDown();
  } else if (cell[cursorY + 1][cursorX].class === "cell cell-red") {
    // fight:
    if (defeat()) {
      moveDown();
    }
  } else if (cell[cursorY + 1][cursorX].class === "cell cell-yellow") {
    // change weapon:
    weapon = weapons[dungeon + 1];
    if (attack < attackValues[dungeon + 1]) attack = attackValues[dungeon + 1];
    moveDown();
  } else if (cell[cursorY + 1][cursorX].class === "cell cell-purple") {
    // change dungeon:
    dungeon++;
    enemyLife = 50 + dungeon * 50;
    moveDown();
    // create new board:
    setTimeout(function () {
      resetDungeon();
      createDungeon();
      refresh();
    }, 500);
  } else if (cell[cursorY + 1][cursorX].class === "cell cell-boss") {
    // fight the boss:
    fightBoss();
  }
  function moveDown() {
    cell[cursorY][cursorX].class = "cell cell-white";
    cursorY++;
    cell[cursorY][cursorX].class = "cell cell-blue";
    if (dark) moveDarkness();
    refresh();
  }
}

function moveLeft() {
  // don't leave the board:
  if (cursorX - 1 < 0) return;
  if (cell[cursorY][cursorX - 1].class === "cell cell-white") {
    // move to the left:
    moveLeft();
  } else if (cell[cursorY][cursorX - 1].class === "cell cell-green") {
    // collect health:
    health += 20;
    moveLeft();
  } else if (cell[cursorY][cursorX - 1].class === "cell cell-red") {
    // fight:
    if (defeat()) {
      moveLeft();
    }
  } else if (cell[cursorY][cursorX - 1].class === "cell cell-yellow") {
    // change weapon:
    weapon = weapons[dungeon + 1];
    if (attack < attackValues[dungeon + 1]) attack = attackValues[dungeon + 1];
    moveLeft();
  } else if (cell[cursorY][cursorX - 1].class === "cell cell-purple") {
    // change dungeon:
    dungeon++;
    enemyLife = 50 + dungeon * 50;
    moveLeft();
    // create new board:
    setTimeout(function () {
      resetDungeon();
      createDungeon();
      refresh();
    }, 500);
  } else if (cell[cursorY][cursorX - 1].class === "cell cell-boss") {
    // fight the boss:
    fightBoss();
  }
  function moveLeft() {
    cell[cursorY][cursorX].class = "cell cell-white";
    cursorX--;
    cell[cursorY][cursorX].class = "cell cell-blue";
    if (dark) moveDarkness();
    refresh();
  }
}

function resetDungeon() {
  for (var i = 0; i < boardWidth; i++) {
    for (var j = 0; j < boardHeight; j++) {
      cell[i][j] = { row: i, column: j, class: "cell" };
    }
  }
}

function getSign() {
  var r = Math.floor(Math.random() * 2);
  switch (r) {
    case 0:
      return 1;
    case 1:
      return -1;
  }
}

function defeat() {
  var myDamage = Math.floor(Math.random() * damage[dungeon] / 3) * getSign() + damage[dungeon];
  var enemyDamage = Math.floor(Math.random() * attack / 3) * getSign() + attack;
  enemyLife = enemyLife - enemyDamage;
  if (enemyLife > 0) {
    health = health - myDamage;
    if (health <= 0) {
      dead = true;
      refresh();
      reset();
    }
    refresh();
    return false;
  } else if (enemyLife <= 0) {
    enemyLife = 50 + dungeon * 50;
    XP = XP - reward;
    if (XP === 0) {
      level++;
      // weapon bonus for fine tuning:
      switch (level) {
        case 2:
          attack += 78;
          break;
        case 3:
          attack += 64;
          break;
        case 4:
          attack += 128;
          break;
      }
      XP = 60 + level * 60;
      reward = 10 + level * 10;
      health += level * 20;
    }
    return true;
  }
}

function fightBoss() {
  bossLife -= 120;
  if (bossLife > 0) {
    health -= 120;
    if (health <= 0) {
      dead = true;
      refresh();
      reset();
    }
    refresh();
  } else if (bossLife === 0) {
    win = true;
    refresh();
    reset();
  }
}

function reset() {
  health = 100;
  weapon = weapons[0];
  attack = attackValues[0];
  level = 0;
  XP = 60;
  reward = 10;
  dungeon = 0;
  enemyLife = 50;
  bossLife = 240;
  dead = false;
  win = false;
  for (var i = 0; i < boardWidth; i++) {
    for (var j = 0; j < boardHeight; j++) {
      cell[i][j] = { row: i, column: j, class: "cell" };
    }
  }
  createDungeon();
  refresh();
}

function toggleDarkness() {
  dark = !dark;
  if (dark) {
    for (var i = 0; i < boardWidth; i++) {
      for (var j = 0; j < boardHeight; j++) {
        if (Math.abs(cursorX - cell[i][j].column) > 6 || Math.abs(cursorY - cell[i][j].row) > 6) {
          cell[i][j].class += " cell-dark";
        }
      }
    }
  } else {
    for (var i = 0; i < boardWidth; i++) {
      for (var j = 0; j < boardHeight; j++) {
        cell[i][j].class = cell[i][j].class.replace("cell-dark", "").trim();
      }
    }
  }
  refresh();
}

function moveDarkness() {
  for (var i = 0; i < boardWidth; i++) {
    for (var j = 0; j < boardHeight; j++) {
      cell[i][j].class = cell[i][j].class.replace("cell-dark", "").trim();
      if (Math.abs(cursorX - cell[i][j].column) > 6 || Math.abs(cursorY - cell[i][j].row) > 6) {
        cell[i][j].class += " cell-dark";
      }
    }
  }
}






















