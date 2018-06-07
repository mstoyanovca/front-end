import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {PageHeader, Well} from 'react-bootstrap';
import {Board} from './Board.js';
import {GameNavBar} from './GameNavBar';

class App extends Component {
	
	constructor(props) {
        super(props);
        this.state = {width: 70, height: 50, speed: 100, pause: false, generation: 0, cells: this.createRandomBoard(70, 50, true)};
        this.changeSize = this.changeSize.bind(this);
        this.changeSpeed = this.changeSpeed.bind(this);
        this.play = this.play.bind(this);
        this.isPause = this.isPause.bind(this);
        this.clear = this.clear.bind(this);
        this.setNextGenState = this.setNextGenState.bind(this);
	}
	
	changeSize(width, height) {
		if(width !== this.state.width) this.setState({width: width, height: height, pause: true, generation: 0, cells: this.createRandomBoard(width, height, true)});
	}
	
	changeSpeed(speed) {
		this.setState({speed: speed});
	}
	
	play() {
		if (this.state.generation === 0) this.setState({generation: 1, cells: this.createRandomBoard(this.state.width, this.state.height, false)});
		setTimeout(this.setNextGenState, this.state.speed);
	}
	
	isPause(pause) {
		this.setState({pause: pause})
	}
	
	clear() {
		this.setState({pause: true, generation: 0, cells: this.createRandomBoard(this.state.width, this.state.height, true)});
	}
	
	createRandomBoard(width, height, empty) {
		var cells = [];
		for (var i = 0; i < height; i++) {
			cells[i] = [];
			for (var j = 0; j < width; j++) {
				var r = Math.floor(Math.random() * 2 + 1);
				if(empty) r = 2;
				switch (r) {
				case 1:
					cells[i][j] = {id: j + i * width, className: "cell-young"};
					break;
				case 2:
					cells[i][j] = {id: j + i * width, className: "cell-dead"};
					break;
				default:
					console.log("Error");
				}
				if (width === 100) cells[i][j].className += " cell-small";
			}
		}
		return cells;
	}
	
	setNextGenState() {
		if(this.state.pause) return;
		const {width, height, cells, speed, generation} = this.state;
		
		this.setState({generation: generation + 1});
		this.setState({cells: this.createNextGenCells(width, height, cells)});
		
		setTimeout(this.setNextGenState, speed);
	}
	
	createNextGenCells(width, height, cells) {
		// don't modify the board, till all iterations are over:
		var cellsCopy = JSON.parse(JSON.stringify(cells));  // deep copy
		for (var i = 0; i < height; i++) {
			for (var j = 0; j < width; j++) {
				var count = this.getCount(i, j, cells);  // number of live neighbors
				// game logic:
				if (count < 2 || count > 3) {
					cellsCopy[i][j].className = "cell-dead";
				} else {
					if (cells[i][j].className.includes("cell-young")) cellsCopy[i][j].className = "cell-old";
				}
				if (count === 3 && cells[i][j].className.includes("cell-dead")) {
					cellsCopy[i][j].className = "cell-young";
				}
				if (width === 100) cellsCopy[i][j].className += " cell-small";
			}
		}
		return cellsCopy;
	}
	
	getCount(m, n, cells) {
		var count = 0;
		// check all adjacent cells:
		for (var i = m - 1; i <= m + 1; i++) {
			for (var j = n - 1; j <= n + 1; j++) {
				// make sure you are within the board, don't count yourself:
				if (i >= 0 && j >= 0 && i < this.state.height && j < this.state.width && !(i === m && j === n) && !cells[i][j].className.includes("cell-dead")) {
						count++;
				}
			}
		}
		return count;
	}
	
	render() {
	    return (
	    	<React.StrictMode>
	        	<PageHeader className="text-center">Game of Life</PageHeader>
	        	<GameNavBar generation={this.state.generation} changeSize={this.changeSize} changeSpeed={this.changeSpeed} play={this.play} isPause={this.isPause} clear={this.clear} />
	        	<Board cells = {this.state.cells} />
	        	<Well><i>The cells in light red are younger, the dark red ones are older. Enjoy!</i></Well>
	        </React.StrictMode>
	    );
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
