import React, { Component } from 'react';
import './css/Dungeon.css';

// board size in cells:
var boardWidth = 80;
var boardHeight = 80;

export default class Dungeon extends Component {
	
	constructor(props) {
		super(props);
	    this.state = {dungeon: 0, cells: this.createBoard()};
	    this.createDungeon = this.createDungeon.bind(this);
	}
	
	componentDidMount() {
		window.addEventListener('keydown', this.handleKeyDown);
		this.createDungeon();
	}
	  
	componentWillUnmount() {
		window.removeEventListener('keydown', this.handleKeyDown);
	}
	
	createBoard() {
		var cells = [];
		for (var i = 0; i < boardHeight; i++) {
			cells[i] = [];
			for (var j = 0; j < boardWidth; j++) {
				cells[i][j] = { id: j + i * boardWidth, row: i, column: j, className: "cell" };
			}
	    }
	    return cells;
	}
	
	createDungeon() {
		console.log
		const {dungeon, cells} = this.state;
		// chamber top left corner coordinates:
		var x, y = 0;
		var chamberWidth, chamberHeight = 0;
		var chambers = [];
		var doors = [];
		  
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
			} else {
				return false;
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
		    	cells[door.y][door.x].className = "cell cell-white";
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
		    	cells[door.y][door.x].class = "cell cell-white";
		    	chambers.push({ x: x, y: y, width: chamberWidth, height: chamberHeight });
		    	// drawChamber();
		      return true;
		    }
		    return false;
		}
		
		function checkAvailability(x, y, width, height) {
			// check if the cells that are going to be taken are free:
		    if (x < 0 || x + width > boardWidth || y < 0 || y + height > boardHeight) return false;
		    for (var i = y; i < y + height; i++) {
		    	for (var j = x; j < x + width; j++) {
		    		if (cells[i][j].className === "cell cell-white") {
		    			return false;
		    		}
		    	}
		    }
		    return true;
		}
		
		function drawChamber() {
			for (var i = y; i < y + chamberHeight; i++) {
				for (var j = x; j < x + chamberWidth; j++) {
					cells[i][j].className = "cell cell-white";
				}
		    }
		}
		
		function createContent() {
			var whites = [];
		    for (var i = 0; i < boardWidth; i++) {
		    	for (var j = 0; j < boardHeight; j++) {
		    		if (cells[i][j].className === "cell cell-white") whites.push(cells[i][j]);
		    	}
		    }
		    // create the cursor:
		    var index = Math.floor(Math.random() * whites.length);
		    whites[index].className = "cell cell-blue";
		    // preserve the position of the cursor, not to iterate again during the game:
		    var cursorX = whites[index].column;
		    var cursorY = whites[index].row;
		    whites.splice(index, 1);
		    // create the weapon:
		    index = Math.floor(Math.random() * whites.length);
		    whites[index].className = "cell cell-yellow";
		    whites.splice(index, 1);
		    // create the stairs to the next dungeon:
		    if (dungeon < 4) {
		    	index = Math.floor(Math.random() * whites.length);
		    	whites[index].className = "cell cell-purple";
		    	whites.splice(index, 1);
		    }
		    // create the health items:
		    for (var i = 0; i < 5; i++) {
		    	index = Math.floor(Math.random() * whites.length);
		    	whites[index].className = "cell cell-green";
		    	whites.splice(index, 1);
		    }
		    // create the enemies:
		    for (var i = 0; i < 5; i++) {
		    	index = Math.floor(Math.random() * whites.length);
		    	whites[index].className = "cell cell-red";
		    	whites.splice(index, 1);
		    }
		    // create the boss:
		    if (dungeon === 4) {
		    	var bosses = [{}];
		    	for (var i = 0; i < boardWidth - 1; i++) {
		    		for (var j = 0; j < boardHeight - 1; j++) {
		    			// find a square of four free cells:
		    			if (this.state.cells[i][j].className === "cell cell-white" && this.state.cells[i][j + 1].className === "cell cell-white" && this.state.cells[i + 1][j].className === "cell cell-white" && this.state.cells[i + 1][j + 1].className === "cell cell-white") {
		    				bosses.push([this.state.cells[i][j], this.state.cells[i][j + 1], this.state.cells[i + 1][j], this.state.cells[i + 1][j + 1]]);
		    			}
		    		}
		    	}
		    	// pick a square randomly:
		    	var index = Math.floor(Math.random() * bosses.length);
		    	for (var i = 0; i < bosses[index].length; i++) {
		    		bosses[index][i].className = "cell cell-boss";
		    	}
		    }
		}
	}
	
	/*handleKeyDown(event) {
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
	}*/
	
	render() {
		return (
			<div className="dungeon center-block">
				{this.state.cells.map(row => <div className="my-row" key={row[0].id}>{row.map(cell => <div className="cell" key={cell.id}></div>)}</div>)}
			</div>
		);
	}
}































