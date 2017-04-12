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

var Dungeon = React.createClass({
  displayName: "Dungeon",
  getInitialState: function getInitialState() {
    for (var i = 0; i < boardWidth; i++) {
      cell[i] = [];
      for (var j = 0; j < boardHeight; j++) {
        cell[i][j] = { row: i, column: j, class: "cell" };
      }
    }
    createDungeon();
    return {};
  },
  componentDidMount: function componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  },
  componentWillUnmount: function componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  },
  handleKeyDown: function handleKeyDown(event) {
    // prevent page scrolling from the arrow keys:
    event.preventDefault();
    switch (event.keyCode) {
      case 37:
        // left arrow
        moveLeft();
        break;
      case 38:
        // up arrow
        moveUp();
        break;
      case 39:
        // right arrow
        moveRight();
        break;
      case 40:
        // down arrow
        moveDown();
        break;
    }
  },
  render: function render() {
    return React.createElement(
      "div",
      null,
      this.props.cell.map(function (row, i) {
        return React.createElement(
          "div",
          { className: "my-row" },
          row.map(function (cell, j) {
            return React.createElement("div", { className: cell.class });
          })
        );
      })
    );
  }
});
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
  ReactDOM.render(React.createElement(
    "div",
    null,
    React.createElement(
      "div",
      { className: "sticky" },
      React.createElement(
        "h2",
        { className: "text-center" },
        "React Roguelike"
      ),
      React.createElement(
        "h4",
        { className: "text-center" },
        "Kill the boss in dungeon 4"
      ),
      React.createElement(
        "div",
        { className: "status-bar text-center" },
        React.createElement(
          "span",
          null,
          React.createElement(
            "b",
            null,
            "Health:"
          ),
          " ",
          health
        ),
        React.createElement(
          "span",
          null,
          React.createElement(
            "b",
            null,
            "Weapon:"
          ),
          " ",
          weapon
        ),
        React.createElement(
          "span",
          null,
          React.createElement(
            "b",
            null,
            "Attack:"
          ),
          " ",
          attack
        ),
        React.createElement(
          "span",
          null,
          React.createElement(
            "b",
            null,
            "Level:"
          ),
          " ",
          level
        ),
        React.createElement(
          "span",
          null,
          React.createElement(
            "b",
            null,
            "Next Level:"
          ),
          " ",
          XP,
          " XP"
        ),
        React.createElement(
          "span",
          null,
          React.createElement(
            "b",
            null,
            "Dungeon:"
          ),
          " ",
          dungeon
        ),
        React.createElement(
          Button,
          { bsStyle: "default", onClick: toggleDarkness },
          "Toggle Darkness"
        )
      )
    ),
    React.createElement(
      "div",
      { className: "dungeon center-block" },
      React.createElement(Dungeon, { cell: cell })
    ),
    React.createElement(LossModal, { dead: dead }),
    React.createElement(WinModal, { win: win })
  ), document.getElementById('container'));
}
refresh();

function createDungeon() {
  // chamber top left corner coordinates:
  var x,
      y = 0;
  var chamberWidth,
      chamberHeight = 0;
  chambers = [];
  doors = [];
  // 20 gives good board density:
  for (var i = 0; i < 20; i++) {
    createChamber();
  }
  createContent();
  function createChamber() {
    // random size from 6 to 18 by 6 to 18 cells:
    chamberWidth = Math.floor(Math.random() * 13) + 6;
    chamberHeight = Math.floor(Math.random() * 13) + 6;
    // position the first chamber randomly in the top left corner:
    if (createFirst()) return;
    // for chambers two and up, attach to an existing chamber:
    for (var i = 0; i < chambers.length; i++) {
      if (attachRight(chambers[i])) return;
      if (attachBottom(chambers[i])) return;
    }
  }
  function createFirst() {
    if (chambers.length === 0) {
      // position the first chamber randomly in the top left corner:
      x = Math.floor(Math.random() * 11);
      y = Math.floor(Math.random() * 11);
      chambers.push({ x: x, y: y, width: chamberWidth, height: chamberHeight });
      drawChamber();
      return true;
    }
  }
  function attachRight(chamber) {
    // try to attach to the right of an existing chamber:
    x = chamber.x + chamber.width + 1;
    var possibleYs = [];
    for (var i = chamber.y - chamberHeight + 1; i < chamber.y + chamber.height; i++) {
      if (checkAvailability(x, i, chamberWidth, chamberHeight)) {
        possibleYs.push(i);
      }
    }
    if (possibleYs.length > 0) {
      var index = Math.floor(Math.random() * possibleYs.length);
      y = possibleYs[index];
      // create a door between the chambers:
      var overlappingYs = [];
      for (var i = y; i < y + chamberHeight; i++) {
        if (i >= chamber.y && i < chamber.y + chamber.height) {
          overlappingYs.push(i);
        }
      }
      index = Math.floor(Math.random() * overlappingYs.length);
      var door = { x: x - 1, y: overlappingYs[index] };
      doors.push(door);
      chambers.push({ x: x, y: y, width: chamberWidth, height: chamberHeight });
      cell[door.y][door.x].class = "cell cell-white";
      drawChamber();
      return true;
    }
    return false;
  }
  function attachBottom(chamber) {
    // try to attach to the bottom of an existing chamber:
    y = chamber.y + chamber.height + 1;
    var possibleXs = [];
    for (var i = chamber.x - chamberWidth + 1; i < chamber.x + chamber.width; i++) {
      if (checkAvailability(i, y, chamberWidth, chamberHeight)) {
        possibleXs.push(i);
      }
    }
    if (possibleXs.length > 0) {
      var index = Math.floor(Math.random() * possibleXs.length);
      x = possibleXs[index];
      // create a door between the chambers:
      var overlappingXs = [];
      for (var i = x; i < x + chamberWidth; i++) {
        if (i >= chamber.x && i < chamber.x + chamber.width) {
          overlappingXs.push(i);
        }
      }
      index = Math.floor(Math.random() * overlappingXs.length);
      var door = { x: overlappingXs[index], y: y - 1 };
      doors.push(door);
      chambers.push({ x: x, y: y, width: chamberWidth, height: chamberHeight });
      cell[door.y][door.x].class = "cell cell-white";
      chambers.push({ x: x, y: y, width: chamberWidth, height: chamberHeight });
      drawChamber();
      return true;
    }
    return false;
  }
  function checkAvailability(x, y, width, height) {
    // check if the cells that are going to be taken are free:
    if (x < 0 || x + width > boardWidth || y < 0 || y + height > boardHeight) return false;
    for (var i = y; i < y + height; i++) {
      for (var j = x; j < x + width; j++) {
        if (cell[i][j].class === "cell cell-white") {
          return false;
        }
      }
    }
    // console.log("true");
    return true;
  }
  function drawChamber() {
    for (var i = y; i < y + chamberHeight; i++) {
      for (var j = x; j < x + chamberWidth; j++) {
        cell[i][j].class = "cell cell-white";
      }
    }
  }
  function createContent() {
    var whites = [];
    for (var i = 0; i < boardWidth; i++) {
      for (var j = 0; j < boardHeight; j++) {
        if (cell[i][j].class === "cell cell-white") whites.push(cell[i][j]);
      }
    }
    // create the cursor:
    var index = Math.floor(Math.random() * whites.length);
    whites[index].class = "cell cell-blue";
    // preserve the position of the cursor, so you don't
    // have to iterate again during the game:
    cursorX = whites[index].column;
    cursorY = whites[index].row;
    whites.splice(index, 1);
    // create the weapon:
    index = Math.floor(Math.random() * whites.length);
    whites[index].class = "cell cell-yellow";
    whites.splice(index, 1);
    // create the stairs to the next dungeon:
    if (dungeon < 4) {
      index = Math.floor(Math.random() * whites.length);
      whites[index].class = "cell cell-purple";
      whites.splice(index, 1);
    }
    // create the health items:
    for (var i = 0; i < 5; i++) {
      index = Math.floor(Math.random() * whites.length);
      whites[index].class = "cell cell-green";
      whites.splice(index, 1);
    }
    // create the enemies:
    for (var i = 0; i < 5; i++) {
      index = Math.floor(Math.random() * whites.length);
      whites[index].class = "cell cell-red";
      whites.splice(index, 1);
    }
    // create the boss:
    if (dungeon === 4) {
      var bosses = [{}];
      for (var i = 0; i < boardWidth - 1; i++) {
        for (var j = 0; j < boardHeight - 1; j++) {
          // find a square of four free cells:
          if (cell[i][j].class === "cell cell-white" && cell[i][j + 1].class === "cell cell-white" && cell[i + 1][j].class === "cell cell-white" && cell[i + 1][j + 1].class === "cell cell-white") {
            bosses.push([cell[i][j], cell[i][j + 1], cell[i + 1][j], cell[i + 1][j + 1]]);
          }
        }
      }
      // pick a square randomly:
      var index = Math.floor(Math.random() * bosses.length);
      for (var i = 0; i < bosses[index].length; i++) {
        bosses[index][i].class = "cell cell-boss";
      }
    }
  }
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