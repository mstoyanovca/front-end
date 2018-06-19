import React, { Component } from 'react';
import './css/Dungeon.css';

export default class Dungeon extends Component {
	
	componentDidMount() {
		window.addEventListener('keydown', this.onKeyDown);
	}
	  
	componentWillUnmount() {
		window.removeEventListener('keydown', this.onKeyDown);
	}
	
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































