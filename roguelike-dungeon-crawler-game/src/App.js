import React, { Component } from 'react';
import Dungeon from './Dungeon';
import Header from './Header';

//board size in cells:
var width = 80;
var height = 80;

export default class App extends Component {
	
	constructor(props) {
		super(props);
	    this.state = {dungeon: 0, cells: this.createBoard()};
	}
	
	createBoard() {
		var cells = [];
		for (var i = 0; i < height; i++) {
			cells[i] = [];
			for (var j = 0; j < width; j++) {
				cells[i][j] = { id: j + i * width, row: i, column: j, className: "cell" };
			}
	    }
	    return cells;
	}
	
	createDungeon() {
		const {dungeon, cells} = this.state;
		var chambers = [];
		var doors = [];
		
		chambers.push(this.createFirstChamber());
		  
		// 20 gives good board density:
		for (var i = 0; i < 20; i++) {
			// createChamber();
		}
		
		this.drawChambers(chambers, cells);
	}
	
	createFirstChamber() {
		// random size from 6 to 18 by 6 to 18 cells:
		var width = Math.floor(Math.random() * 13) + 6;
		var height = Math.floor(Math.random() * 13) + 6;
		// position the first chamber randomly in the top left corner:
		var x = Math.floor(Math.random() * 11);
		var y = Math.floor(Math.random() * 11);
		var chamber = { x: x, y: y, width: width, height: height };
		console.log("in createFirstChamber(): " + "x = " + x + ", y = " + y, ", width = " + width, ", height = " + height);
		return chamber;
	}
	
	drawChambers(chambers, cells) {
		// console.log("in drawChambers(): " + "x = " + x + ", y = " + y + ", chamberWidth = " + chamberWidth + ", chamberHeight = " + chamberHeight);
		chambers.map(c => {
			for (var i = c.y; i < c.y + c.height; i++) {
				for (var j = c.x; j < c.x + c.width; j++) {
					cells[i][j].className += " cell-white";
					// console.log("cells["+i+"]["+j+"].className = " + cells[i][j].className);
				}
		    }
		});
		this.setState({cells: cells});
		console.log("cells = " + JSON.stringify(this.state.cells));
	}
	
	componentDidMount() {
		this.createDungeon();
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
