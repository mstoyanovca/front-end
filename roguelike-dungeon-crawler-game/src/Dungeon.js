import React, { Component } from 'react';
import './css/Dungeon.css';

export default class Dungeon extends Component {
	
	constructor(props) {
		super(props);
	    this.state = {enemyLife: 50}; // add 50 per dungeon
	}
	
	componentDidMount() {
		window.addEventListener('keydown', this.onKeyDown);
	}
	  
	componentWillUnmount() {
		window.removeEventListener('keydown', this.onKeyDown);
	}
	
	onKeyDown = (event) => {
		// prevent page scrolling from the arrow keys:
	    event.preventDefault();
	    switch (event.keyCode) {
	    	case 37:
	    		console.log("move left");
	    		// moveLeft();
	    		break;
	    	case 38:
	    		console.log("move up");
	    		this.moveUp();
	    		break;
	    	case 39:
	    		console.log("move right");
	    		// moveRight();
	    		break;
	    	case 40:
	    		console.log("move down");
	    		// moveDown();
	    		break;
	    	default:
	    		// do nothing
	    }
	}
	
	moveUp() {
		let cells = this.props.cells;
		let cursor = this.props.cursor;
		let health = this.props.health;
		let dungeon = this.props.dungeon;
		
		// don't leave the board:
		if (cursor.y === 0) return;
		if (cells[cursor.y - 1][cursor.x].className === "cell empty") {
			// move up:
		    moveUp();
		} else if (cells[cursor.y - 1][cursor.x].className === "cell health") {
		    health += 20;
		    moveUp();
		} else if (cells[cursor.y - 1][cursor.x].className === "cell enemy") {
		    // fight:
		    //if (defeat()) {
		      moveUp();
		    //}
		} else if (cells[cursor.y - 1][cursor.x].className === "cell weapon") {
		    // change weapon:
			let weapon = this.props.weapons[this.props.dungeon + 1];
			console.log("weapon = " + weapon);
		    //if (attack < this.props.attackValues[this.state.dungeon + 1]) attack = this.props.attackValues[this.state.dungeon + 1];
		    moveUp();
		} else if (cells[cursor.y - 1][cursor.x].className === "cell stairs") {
		    // change dungeon:
		    dungeon += 1;
		    this.state.enemyLife = 50 + this.state.dungeon * 50;
		    moveUp();
		    // create new board:
		    setTimeout(function () {
		      //resetDungeon();
		      //createDungeon();
		      //refresh();
		    }, 500);
		} else if (cells[cursor.y - 1][cursor.x].className === "cell boss") {
		    // fight the boss:
		    // fightBoss();
		}
		function moveUp() {
			cells[cursor.y][cursor.x].className = "cell empty";
		    cursor.y--;
			cells[cursor.y][cursor.x].className = "cell cursor";
		    //if (dark) moveDarkness();
		    //refresh();
		}
	}
	
	render() {
		return (
			<div className="dungeon center-block">
				{this.props.cells.map(row => <div className="board-row" key={row[0].id}>{row.map(cell => <div className={cell.className} key={cell.id}></div>)}</div>)}
			</div>
		);
	}
}































