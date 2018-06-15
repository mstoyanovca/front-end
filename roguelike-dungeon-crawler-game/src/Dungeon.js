import React, { Component } from 'react';
import './css/Dungeon.css';

export default class Dungeon extends Component {
	
	componentDidMount() {
		window.addEventListener('keydown', this.onKeyDown);
	}
	  
	componentWillUnmount() {
		window.removeEventListener('keydown', this.onKeyDown);
	}
	
		// createContent();
	
		/*attachRight(chamber) {
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
		    	for (i = y; i < y + chamberHeight; i++) {
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
		}*/
		  
		/*attachBottom(chamber) {
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
		    	for (i = x; i < x + chamberWidth; i++) {
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
		}*/
		
		/*checkAvailability(x, y, width, height) {
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
		}*/
		
		/*createContent() {
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
		    for (i = 0; i < 5; i++) {
		    	index = Math.floor(Math.random() * whites.length);
		    	whites[index].className = "cell cell-green";
		    	whites.splice(index, 1);
		    }
		    // create the enemies:
		    for (i = 0; i < 5; i++) {
		    	index = Math.floor(Math.random() * whites.length);
		    	whites[index].className = "cell cell-red";
		    	whites.splice(index, 1);
		    }
		    // create the boss:
		    if (dungeon === 4) {
		    	var bosses = [{}];
		    	for (i = 0; i < boardWidth - 1; i++) {
		    		for (j = 0; j < boardHeight - 1; j++) {
		    			// find a square of four free cells:
		    			if (this.state.cells[i][j].className === "cell cell-white" && this.state.cells[i][j + 1].className === "cell cell-white" && this.state.cells[i + 1][j].className === "cell cell-white" && this.state.cells[i + 1][j + 1].className === "cell cell-white") {
		    				bosses.push([this.state.cells[i][j], this.state.cells[i][j + 1], this.state.cells[i + 1][j], this.state.cells[i + 1][j + 1]]);
		    			}
		    		}
		    	}
		    	// pick a square randomly:
		    	index = Math.floor(Math.random() * bosses.length);
		    	for (i = 0; i < bosses[index].length; i++) {
		    		bosses[index][i].className = "cell cell-boss";
		    	}
		    }
		}*/
	
	onKeyDown = (event) => {
		// prevent page scrolling from the arrow keys:
	    event.preventDefault();
	    switch (event.keyCode) {
	    	case 37:
	    		// left arrow
	    		console.log("move left");
	    		// moveLeft();
	    		break;
	    	case 38:
	    		// up arrow
	    		console.log("move up");
	    		// moveUp();
	    		break;
	    	case 39:
	    		// right arrow
	    		console.log("move right");
	    		// moveRight();
	    		break;
	    	case 40:
	    		// down arrow
	    		console.log("move down");
	    		// moveDown();
	    		break;
	    	default:
	    		// do nothing
	    }
	}
	
	render() {
		return (
			<div className="dungeon center-block">
				{this.props.cells.map(row => <div className="my-row" key={row[0].id}>{row.map(cell => <div className={cell.className} key={cell.id}></div>)}</div>)}
			</div>
		);
	}
}































