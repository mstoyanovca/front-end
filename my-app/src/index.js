import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {PageHeader, Navbar, Nav, NavDropdown, MenuItem, NavItem, Well} from 'react-bootstrap';

var width = 70;
var height = 50;
var speed = 50;
var pause = false;
var generation = 0;
var cell = []; // the game board
var timer;

class MyNavBar extends React.Component {
	redraw() {
	    pause = true;
	    clearTimeout(timer);
	    generation = 0;
	    var myClass = "cell-dead";
	    if (width === 100) myClass += " cell-small";
	    cell = [];
	    for (var i = 0; i < height; i++) {
	        cell[i] = [];
	        for (var j = 0; j < width; j++) {
	        	cell[i][j] = { id: j + i * width, class: myClass };
	        }
	    }
	    refresh();
	}
	handleSelect(selectedKey) {
	    switch (selectedKey) {
	        case 1.1:
	            width = 50;
	            height = 30;
	            this.redraw();
	            break;
	        case 1.2:
	        	width = 70;
	        	height = 50;
	        	this.redraw();
	        	break;
	        case 1.3:
	        	width = 100;
	        	height = 80;
	        	this.redraw();
	        	break;
	        case 1.4:
	        	speed = 200; // slow
	        	break;
	        case 1.5:
	        	speed = 100; // medium
	        	break;
	        case 1.6:
	        	speed = 50; // fast
	        	break;
	        case 2:
	        	pause = false;
	        	// play(); // run
	        	break;
	        case 3:
	        	pause = true;  // pause
	        	clearTimeout(timer);
	        	break;
	        case 4:
	        	this.redraw();  // clear
	        	break;
	    	}
	}
	render() {
	    return (
	    	<Navbar>
	    	    <Navbar.Header>
	    		    <Navbar.Brand>
	    	            <a href="https://www.math.cornell.edu/~lipa/mec/lesson6.html" target="_blank">Game of Life</a>
	    	        </Navbar.Brand>
	    	    </Navbar.Header>
	    	    <Nav bsStyle="pills" onSelect={e => this.handleSelect(e)}>
	    	        <NavDropdown eventKey={1} title="Options" id="basic-nav-dropdown">
	    	            <MenuItem eventKey={1.1}>Size: 50x30</MenuItem>
	    	            <MenuItem eventKey={1.2}>Size: 70x50</MenuItem>
	    	            <MenuItem eventKey={1.3}>Szie: 100x80</MenuItem>
	    	            <MenuItem divider />
	    	            <MenuItem eventKey={1.4}>Sim speed: Slow</MenuItem>
	    	            <MenuItem eventKey={1.5}>Sim speed: Medium</MenuItem>
	    	            <MenuItem eventKey={1.6}>Sim speed: Fast</MenuItem>
	    	        </NavDropdown>
	    	        <NavItem eventKey="2" href="#"><span className="glyphicon glyphicon-play" aria-hidden="true">Run</span></NavItem>
	    	        <NavItem eventKey="3" href="#"><span className="glyphicon glyphicon-pause" aria-hidden="true">Pause</span></NavItem>
	    	        <NavItem eventKey="4" href="#"><span className="glyphicon glyphicon-stop" aria-hidden="true">Clear</span></NavItem>
	    	        <NavItem eventKey="5" href="#">Generation: {generation}</NavItem>
	    	    </Nav>
	    	</Navbar>
	    );
	}
}
  
var Board = React.Component({
  displayName: "Board",
  getInitialState: function getInitialState() {
    for (var i = 0; i < height; i++) {
      cell[i] = [];
      for (var j = 0; j < width; j++) {
        cell[i][j] = { id: j + i * width, class: "cell-dead" };
      }
    }
    return {};
  },
  render: function render() {
    var _this = this;
    return React.createElement("div", { className: "board" }, this.props.cell.map(function (row, i) {
        return React.createElement("div", { className: "my-row" }, row.map(function (column, j) {
            return React.createElement("div", { id: j + i * width, key: j + i * width, className: _this.props.cell[i][j].class });
        }));
    }));
  }
});

function play() {
  if (generation === 0) {
    generation++;
    // initialize the board randomly:
    for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
        var r = Math.floor(Math.random() * 2 + 1);
        switch (r) {
          case 1:
            cell[i][j].class = "cell-young";
            break;
          case 2:
            cell[i][j].class = "cell-dead";
            break;
        }
        if (width === 100) cell[i][j].class += " cell-small";
      }
    }
    refresh();
  }
  // generations 2 and up:
  if (!pause) {
    timer = setTimeout(function () {
      nextGeneration();
    }, speed);
  }
  // recursive function:
  function nextGeneration() {
    generation++;
    // don't modify the board, till all iterations are over:
    var cellCopy = JSON.parse(JSON.stringify(cell)); // deep copy
    for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
        var status = getStatus(i, j);  // dead or live
        var count = getCount(i, j);    // number of live neighbors
        // game logic:
        if (status === "live") {
          if (count < 2 || count > 3) {
            cellCopy[i][j].class = "cell-dead";
          } else if (count === 2 || count === 3) {
            // damned IE:
            // if(cell[i][j].class.startsWith("cell-young")) {
            if (/cell-young/.test(cell[i][j].class)) {
              cellCopy[i][j].class = "cell-old";
            }
          }
        } else if (status === "dead" && count === 3) {
          cellCopy[i][j].class = "cell-young";
        }
        if (width === 100) cellCopy[i][j].class += " cell-small";
      }
    }
    cell = cellCopy;
    refresh();
    if (!pause) {
      timer = setTimeout(function () {
        nextGeneration();
      }, speed);
    }
  }
  function getStatus(i, j) {
    // the same here:
    // if(cell[i][j].class.startsWith("cell-dead")) {
    if (/cell-dead/.test(cell[i][j].class)) {
      return "dead";
    } else {
      return "live";
    }
  }
  function getCount(m, n) {
    var count = 0;
    // check all adjacent cells:
    for (var i = m - 1; i <= m + 1; i++) {
      for (var j = n - 1; j <= n + 1; j++) {
        // make sure you are within the board:
        if (i >= 0 && j >= 0 && i < height && j < width) {
          // don't count yourself:
          if (i !== m || j !== n) {
            if (getStatus(i, j) === "live") count++;
          }
        }
      }
    }
    return count;
  }
}

class App extends Component {
	  render() {
	    return (
	      <div>
	        <PageHeader className="text-center">Game of Life</PageHeader>
	        <MyNavBar />
	        <Well><i>The cells in light red are younger, dark red are older. Enjoy!</i></Well>
	      </div>
	    );
	  }
	}

function refresh() {
	ReactDOM.render(<App />, document.getElementById('root'));
	// <Board cell=cell></Board>
}

refresh();







