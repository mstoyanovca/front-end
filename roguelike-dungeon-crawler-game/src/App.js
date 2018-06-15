import React, { Component } from 'react';
import Dungeon from './Dungeon';
import Header from './Header';

// board size in cells:
const boardWidth = 80;
const boardHeight = 80;

export default class App extends Component {
	
	constructor(props) {
		super(props);
	    this.state = {cells: this.createEmptyBoard()};
	}
	
	componentDidMount() {
		this.createDungeon();
	}
	
	createEmptyBoard() {
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
		var chambers = [];
		var doors = [];
		
		// 20 gives good board density:
		for (var i = 0; i < 10; i++) {
			if(i === 0) {
				chambers.push(this.createChamber(true));
				this.drawChambers(chambers, []);
			} else {
				var chamber = this.createChamber(false);
				var chamberWithDoor = this.attachToTheRight(chambers[i-1], chamber);
				if(chamberWithDoor.chamber.x >= 0) {
					chambers.push(chamberWithDoor.chamber);
					doors.push(chamberWithDoor.door);
					this.drawChambers(chambers, doors);
					continue;
				}
				chamberWithDoor = this.attachToTheBottom(chambers[i-1], chamber);
				if(chamberWithDoor.chamber.x >= 0) {
					chambers.push(chamberWithDoor.chamber);
					doors.push(chamberWithDoor.door);
					this.drawChambers(chambers, doors);
				}
			}
		}
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
			x = Math.floor(Math.random() * 11);
			y = Math.floor(Math.random() * 11);
		}
		
		return { x: x, y: y, width: width, height: height };
	}
	
	attachToTheRight(previousChamber, chamber) {
	    // try to attach to the right of an existing chamber:
	    chamber.x = previousChamber.x + previousChamber.width + 1;
	    
	    var possibleYs = [];
	    for (var i = previousChamber.y - chamber.height + 1; i < previousChamber.y + previousChamber.height; i++) {
	    	if (this.checkAvailability(chamber.x, i, chamber.width, chamber.height)) {
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
	
	attachToTheBottom(previousChamber, chamber) {
		// try to attach to the bottom of an existing chamber:
		chamber.y = previousChamber.y + previousChamber.height + 1;
		
	    var possibleXs = [];
	    for (var i = previousChamber.x - chamber.width + 1; i < previousChamber.x + chamber.width; i++) {
	    	if (this.checkAvailability(i, chamber.y, chamber.width, chamber.height)) {
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
	
	checkAvailability(x, y, width, height) {
		// make sure the new chamber is within the board:
	    if (x < 0 || x + width > boardWidth || y < 0 || y + height > boardHeight) return false;
	    
	    // check if the cells that are going to be taken are free:
	    for (var i = y; i < y + height; i++) {
	    	for (var j = x; j < x + width; j++) {
	    		if (this.state.cells[i][j].className.includes("cell-white")) return false;
	    	}
	    }
	    
	    return true;
	}
	
	drawChambers(chambers, doors) {
		var cellsCopy = JSON.parse(JSON.stringify(this.state.cells));
		chambers.forEach(c => {
			for (var i = c.y; i < c.y + c.height; i++) {
				for (var j = c.x; j < c.x + c.width; j++) {
					cellsCopy[i][j].className += " cell-white";
				}
		    }
		});
		
		doors.forEach(door => cellsCopy[door.y][door.x].className += " cell-white");
		
		this.setState({cells: cellsCopy});
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
