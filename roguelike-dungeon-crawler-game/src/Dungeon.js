import React, { Component } from 'react';
import './css/Dungeon.css';

// tune the game here:
const damage = [7, 20, 32, 42, 58];  // per dungeon
// enemyLife = 50, add 50 per dungeon;
// reward = 10, add 10 per level;

export default class Dungeon extends Component {
	
	constructor(props) {
		super(props);
	    this.state = {enemyLife: 50, reward: 10};
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
	    		this.moveLeft();
	    		break;
	    	case 38:
	    		this.moveUp();
	    		break;
	    	case 39:
	    		this.moveRight();
	    		break;
	    	case 40:
	    		this.moveDown();
	    		break;
	    	default:
	    		// do nothing
	    }
	}
	
	moveUp() {
		const {health, dungeon, cells, cursor} = this.props;
		let {weapon, attack} = this.props;
		
		// don't leave the board:
		if (cursor.y === 0) return;
		
		if (cells[cursor.y - 1][cursor.x].className.includes("empty")) {
			this.mvUp(cells, cursor);
		} else if (cells[cursor.y - 1][cursor.x].className.includes("health")) {
			this.props.updateHealth(health + 20);
			this.mvUp(cells, cursor);
		} else if (cells[cursor.y - 1][cursor.x].className.includes("enemy")) {
		    if (this.defeat()) this.mvUp(cells, cursor);
		} else if (cells[cursor.y - 1][cursor.x].className.includes("weapon")) {
		    this.props.updateWeapon(this.props.weapons[dungeon + 1], this.props.attackValues[dungeon + 1]);
		    this.mvUp(cells, cursor);
		} else if (cells[cursor.y - 1][cursor.x].className.includes("stairs")) {
		    let enemyLife = 50 + dungeon * 50;
		    this.move(health, dungeon + 1, cells, cursor);
		    // create new board:
		    setTimeout(function () {
		      //resetDungeon();
		      //createDungeon();
		      //refresh();
		    }, 500);
		} else if (cells[cursor.y - 1][cursor.x].className.includes("boss")) {
		    // fight the boss:
		    // fightBoss();
		}
	}
	
	moveRight() {
		const {boardWidth, health, cells, cursor, dungeon} = this.props;
		let {attack} = this.props;
		
		// don't leave the board:
		if (cursor.x + 1 === boardWidth) return;
		
		if (cells[cursor.y][cursor.x + 1].className.includes("empty")) {
			this.mvRight(cells, cursor);
		} else if (cells[cursor.y][cursor.x + 1].className.includes("health")) {
			this.props.updateHealth(health + 20);
			this.mvRight(cells, cursor);
		} else if (cells[cursor.y][cursor.x + 1].className.includes("enemy")) {
			if (this.defeat()) this.mvRight(cells, cursor);
		} else if (cells[cursor.y][cursor.x + 1].className.includes("weapon")) {
			this.props.updateWeapon(this.props.weapons[dungeon + 1], this.props.attackValues[dungeon + 1]);
			this.mvRight(cells, cursor);
		} else if (cells[cursor.y][cursor.x + 1].className.includes("stairs")) {
			// change dungeon:
			let enemyLife = 50 + dungeon * 50;
			this.move(health, dungeon + 1, cells, cursor);
			// create new board:
			/*setTimeout(function () {
				resetDungeon();
				createDungeon();
				refresh();
			}, 500);*/
		} else if (cells[cursor.y][cursor.x + 1].className.includes("boss")) {
			// fight the boss:
			// fightBoss();
		}
	}
	
	moveDown() {
		const {boardHeight, health, cells, cursor, dungeon} = this.props;
		let {attack} = this.props;
		
		// don't leave the board:
		if (cursor.y + 1 === boardHeight) return;
		
		if (cells[cursor.y + 1][cursor.x].className.includes("empty")) {
			this.mvDown(cells, cursor);
		} else if (cells[cursor.y + 1][cursor.x].className.includes("health")) {
			this.props.updateHealth(health + 20);
			this.mvDown(cells, cursor);
		} else if (cells[cursor.y + 1][cursor.x].className.includes("enemy")) {
		    if (this.defeat()) this.mvDown(cells, cursor);
		} else if (cells[cursor.y + 1][cursor.x].className.includes("weapon")) {
			this.props.updateWeapon(this.props.weapons[dungeon + 1], this.props.attackValues[dungeon + 1]);
			this.mvDown(cells, cursor);
		} else if (cells[cursor.y + 1][cursor.x].className.includes("stairs")) {
		    // change dungeon:
		    let enemyLife = 50 + dungeon * 50;
		    this.move(health, dungeon + 1, cells, cursor);
		    // create new board:
		    /*setTimeout(function () {
		    	resetDungeon();
		    	createDungeon();
		    	refresh();
		    }, 500);*/
		} else if (cells[cursor.y + 1][cursor.x].className.includes("boss")) {
			// fight the boss:
		    // fightBoss();
		}
	}
	
	moveLeft() {
		const {boardHeight, health, cells, cursor, dungeon} = this.props;
		let {attack} = this.props;
		const {reward} = this.state;
		
		// don't leave the board:
		if (cursor.x - 1 < 0) return;
		
		if (cells[cursor.y][cursor.x - 1].className.includes("empty")) {
			this.mvLeft(cells, cursor);
		} else if (cells[cursor.y][cursor.x - 1].className.includes("health")) {
			this.props.updateHealth(health + 20);
			this.mvLeft(cells, cursor);
		} else if (cells[cursor.y][cursor.x - 1].className.includes("enemy")) {
		    if (this.defeat()) this.mvLeft(cells, cursor);
		} else if (cells[cursor.y][cursor.x - 1].className.includes("weapon")) {
			this.props.updateWeapon(this.props.weapons[dungeon + 1], this.props.attackValues[dungeon + 1]);
			this.mvLeft(cells, cursor);
		} else if (cells[cursor.y][cursor.x - 1].className.includes("stairs")) {
		    // change dungeon:
		    let enemyLife = 50 + dungeon * 50;
		    this.move(health, dungeon + 1, cells, cursor);
		    // create new board:
		    /*setTimeout(function () {
		    	resetDungeon();
		    	createDungeon();
		    	refresh();
		    }, 500);*/
		} else if (cells[cursor.y][cursor.x - 1].className.includes("boss")) {
			  // fight the boss:
			  // fightBoss();
		}
	}
	
	mvUp(cells, cursor) {
		cells[cursor.y - 1][cursor.x].className = "cell cursor";
		cells[cursor.y][cursor.x].className = "cell empty";
		cursor.y--;
		// if (dark) moveDarkness();
		this.props.move(cells, cursor);
	}
	
	mvRight(cells, cursor) {
		cells[cursor.y][cursor.x + 1].className = "cell cursor";
		cells[cursor.y][cursor.x].className = "cell empty";
		cursor.x++;
		// if (dark) moveDarkness();
		this.props.move(cells, cursor);
	}
	
	mvDown(cells, cursor) {
		cells[cursor.y + 1][cursor.x].className = "cell cursor";
		cells[cursor.y][cursor.x].className = "cell empty";
		cursor.y++;
		// if (dark) moveDarkness();
		this.props.move(cells, cursor);
	}
	
	mvLeft(cells, cursor) {
		cells[cursor.y][cursor.x - 1].className = "cell cursor"
		cells[cursor.y][cursor.x].className = "cell empty";
		cursor.x--;
		// if (dark) moveDarkness();
		this.props.move(cells, cursor);
	}
	
	defeat() {
		const {dungeon} = this.props;
		let {health, attack, nextLevelPoints, level} = this.props;
		let {reward, enemyLife} = this.state;
		
		let myDamage = Math.floor(Math.random() * damage[dungeon] / 3) * this.getSign() + damage[dungeon];
		let enemyDamage = Math.floor(Math.random() * attack / 3) * this.getSign() + attack;
		enemyLife = enemyLife - enemyDamage;
		
		if (enemyLife > 0) {
		    if (health - myDamage <= 0) {
		    	console.log("Game over!");
		    	// refresh();
		    	// reset();
		    }
		    this.setState({enemyLife: enemyLife});
		    this.props.updateHealth(health - myDamage);
		    return false;
		} else {
			this.setState({enemyLife: 50 + dungeon * 50});
			this.props.updateNextLevelPoints(nextLevelPoints - reward);
		    if (nextLevelPoints === 0) {
		    	this.props.updateLevel(level++);
		    	// weapon bonus for fine tuning:
		    	switch (level) {
		        	case 2:
		        		this.props.updateAttack(attack + 78);
		        		break;
		        	case 3:
		        		this.props.updateAttack(attack + 64);
		        		break;
		        	case 4:
		        		this.props.updateAttack(attack + 128);
		        		break;
		    	}
		    	this.props.updateNextLevelPoints(60 + level * 60);
		    	this.setState({reward: 10 + level * 10});
		    	this.props.updateHealth(health + level * 20);
		    }
		    return true;
		}
	}
	
	getSign() {
		var r = Math.floor(Math.random() * 2);
		switch (r) {
		case 0:
			return 1;
		case 1:
			return -1;
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































