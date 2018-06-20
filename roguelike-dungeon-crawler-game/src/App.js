import React, { Component } from 'react';
import Dungeon from './Dungeon';
import Header from './Header';

// board size in cells:
const boardWidth = 80;
const boardHeight = 80;
// 20 gives good board density:
const numberOfChambers = 20;
var cursorX = 0;
var cursorY = 0;
var dungeon = 0;

export default class App extends Component {
	
	constructor(props) {
		super(props);
	    this.state = {cells: []};
	}
	
	componentDidMount() {
		var cells = this.createEmptyBoard();
		cells = this.createDungeon(cells);
		cells = this.createContent(cells);
		
		this.setState({cells: cells});
	}
	
	createEmptyBoard() {
		var cells = [];
		for (var i = 0; i < boardHeight; i++) {
			cells[i] = [];
			for (var j = 0; j < boardWidth; j++) {
				cells[i][j] = {id: j + i * boardWidth, row: i, column: j, className: "cell"};
			}
	    }
	    return cells;
	}
	
	createDungeon(cells) {
		var chambers = [];
		var doors = [];
		
		for (var i = 0; i < numberOfChambers; i++) {
			if(i === 0) {
				chambers.push(this.createChamber(true));
				cells = this.redrawBoard(chambers, doors, cells);
			} else {
				var chamber = this.createChamber(false);
				
				for(var j = 0; j < i; j++) {
					var chamberWithDoor = this.attachToTheRight(chambers[j], chamber, cells);
					if(chamberWithDoor.chamber.x >= 0) {
						chambers.push(chamberWithDoor.chamber);
						doors.push(chamberWithDoor.door);
						cells = this.redrawBoard(chambers, doors, cells);
						break;
					}
					chamberWithDoor = this.attachToTheBottom(chambers[j], chamber, cells);
					if(chamberWithDoor.chamber.y >= 0) {
						chambers.push(chamberWithDoor.chamber);
						doors.push(chamberWithDoor.door);
						cells = this.redrawBoard(chambers, doors, cells);
						break;
					}
				}
			}
		}
		
		return cells;
	}
	
	createChamber(isFirst) {
		// random size from 6 to 18 by 6 to 18 cells:
		var width = Math.floor(Math.random() * 13) + 6;
		var height = Math.floor(Math.random() * 13) + 6;
		
		// chambers 2 and up to be positioned later:
		var x = -1;
		var y = -1;
		
		if(isFirst) {
			// position the first chamber randomly in the top left corner:
			x = Math.floor(Math.random() * 21);
			y = Math.floor(Math.random() * 11);
		}
		
		return {x: x, y: y, width: width, height: height};
	}
	
	attachToTheRight(previousChamber, chamber, cells) {
	    // try to attach to the right of an existing chamber:
	    chamber.x = previousChamber.x + previousChamber.width + 1;
	    
	    var possibleYs = [];
	    for (var i = previousChamber.y - chamber.height + 1; i < previousChamber.y + previousChamber.height; i++) {
	    	if (this.checkAvailability(chamber.x, i, chamber.width, chamber.height, cells)) {
	    		possibleYs.push(i);
	    	}
	    }
	    if (possibleYs.length > 0) {
	    	var index = Math.floor(Math.random() * possibleYs.length);
	    	chamber.y = possibleYs[index];
	    } else {
	    	chamber.x = -1;
	    	return {chamber, undefined};
	    }
	    
	    // create a door between the chambers:
	    var overlappingYs = [];
	    for (i = chamber.y; i < chamber.y + chamber.height; i++) {
	    	if (i >= previousChamber.y && i < previousChamber.y + previousChamber.height) {
	    		overlappingYs.push(i);
	    	}
	    }
    	index = Math.floor(Math.random() * overlappingYs.length);
    	var door = { x: chamber.x - 1, y: overlappingYs[index] };
	    
	    return {chamber, door};
	}
	
	attachToTheBottom(previousChamber, chamber, cells) {
		// try to attach to the bottom of an existing chamber:
		chamber.y = previousChamber.y + previousChamber.height + 1;
		
	    var possibleXs = [];
	    for (var i = previousChamber.x - chamber.width + 1; i < previousChamber.x + previousChamber.width; i++) {
	    	if (this.checkAvailability(i, chamber.y, chamber.width, chamber.height, cells)) {
	    		possibleXs.push(i);
	    	}
	    }
	    if (possibleXs.length > 0) {
	    	var index = Math.floor(Math.random() * possibleXs.length);
	    	chamber.x = possibleXs[index];
	    } else {
	    	chamber.y = -1;
	    	return {chamber, undefined};
	    }
	    	
	    // create a door between the chambers:
	    var overlappingXs = [];
	    for (i = chamber.x; i < chamber.x + chamber.width; i++) {
	    	if (i >= previousChamber.x && i < previousChamber.x + previousChamber.width) {
	    		overlappingXs.push(i);
	    	}
	    }
	    index = Math.floor(Math.random() * overlappingXs.length);
	    var door = { x: overlappingXs[index], y: chamber.y - 1 };
	    	
	    return {chamber, door};
	}
	
	checkAvailability(x, y, width, height, cells) {
		// make sure the new chamber is within the board:
	    if (x < 0 || x + width > boardWidth || y < 0 || y + height > boardHeight) return false;
	    
	    // check if the cells that are going to be taken are free:
	    for (var i = y; i < y + height; i++) {
	    	for (var j = x; j < x + width; j++) {
	    		if (cells[i][j].className.includes("empty")) return false;
	    	}
	    }
	    
	    return true;
	}
	
	redrawBoard(chambers, doors, cells) {
		chambers.forEach(c => {
			for (var i = c.y; i < c.y + c.height; i++) {
				for (var j = c.x; j < c.x + c.width; j++) {
					if(cells[i][j].className === "cell") cells[i][j].className += " empty";
				}
		    }
		});
		
		doors.forEach(d => {
			if(cells[d.y][d.x].className === "cell") cells[d.y][d.x].className += " empty"
		});
		
		return cells;
	}
	
	createContent(cells) {
		var emptyCells = [];
	    for (var i = 0; i < boardHeight; i++) {
	    	for (var j = 0; j < boardWidth; j++) {
	    		if (cells[i][j].className.includes("empty")) emptyCells.push(cells[i][j]);
	    	}
	    }
	    
	    // create the cursor:
	    var index = Math.floor(Math.random() * emptyCells.length);
	    cells[emptyCells[index].row][emptyCells[index].column].className += " cursor";
	    // preserve the position of the cursor:
	    cursorX = emptyCells[index].column;
	    cursorY = emptyCells[index].row;
	    emptyCells.splice(index, 1);
	    
	    // create the weapon:
	    index = Math.floor(Math.random() * emptyCells.length);
	    cells[emptyCells[index].row][emptyCells[index].column].className += " weapon";
	    emptyCells.splice(index, 1);
	    
	    // create the stairs to the next dungeon:
	    if (dungeon < 4) {
	    	index = Math.floor(Math.random() * emptyCells.length);
	    	cells[emptyCells[index].row][emptyCells[index].column].className += " stairs";
	    	emptyCells.splice(index, 1);
	    }
	    
	    // create the health items:
	    for (i = 0; i < 5; i++) {
	    	index = Math.floor(Math.random() * emptyCells.length);
	    	cells[emptyCells[index].row][emptyCells[index].column].className += " health";
	    	emptyCells.splice(index, 1);
	    }
	    
	    // create the enemies:
	    for (i = 0; i < 5; i++) {
	    	index = Math.floor(Math.random() * emptyCells.length);
	    	cells[emptyCells[index].row][emptyCells[index].column].className += " enemy";
	    	emptyCells.splice(index, 1);
	    }
	    
	    
	    // create the boss:
	    if (dungeon === 5) {
	    	var bosses = [{}];
	    	for (i = 0; i < boardHeight - 1; i++) {
	    		for (j = 0; j < boardWidth - 1; j++) {
	    			if (cells[i][j].className.includes("empty") && 
	    				cells[i][j + 1].className.includes("empty") && 
	    				cells[i + 1][j].className.includes("empty") && 
	    				cells[i + 1][j + 1].className.includes("empty")) {
	    					bosses.push([cells[i][j], cells[i][j + 1], cells[i + 1][j], cells[i + 1][j + 1]]);
	    			}
	    		}
	    	}
	    	// pick a square randomly:
	    	index = Math.floor(Math.random() * bosses.length);
	    	for (i = 0; i < bosses[index].length; i++) {
	    		cells[bosses[index][i].row][bosses[index][i].column].className += " boss";
	    	}
	    }
	    
	    return cells;
	}
	
	render() {
		return (
			<div>
				<Header />
				<Dungeon cells={this.state.cells} />
			</div>
		);
	}
}
