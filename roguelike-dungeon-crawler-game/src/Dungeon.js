import React, { Component } from 'react';
import './css/Dungeon.css';

export default class Dungeon extends Component {
	
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
				{this.props.cells.map(row => <div className="board-row" key={row[0].id}>{row.map(cell => <div className={cell.className} key={cell.id}></div>)}</div>)}
			</div>
		);
	}
}































