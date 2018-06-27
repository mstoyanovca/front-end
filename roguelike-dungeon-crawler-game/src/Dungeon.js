import React, { Component } from 'react';
import './css/Dungeon.css';

const damage = [7, 20, 32, 42, 58];  // per dungeon
// reward - add 10 for each level;
// enemyLife - add 50 per dungeon;

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
			cells[cursor.y - 1][cursor.x].className = "cell cursor";
			cells[cursor.y][cursor.x].className = "cell empty";
			cursor.y--;
			this.move(cells, cursor);
		} else if (cells[cursor.y - 1][cursor.x].className.includes("health")) {
			this.props.updateHealth(health + 20);
			
			cells[cursor.y - 1][cursor.x].className = "cell cursor";
			cells[cursor.y][cursor.x].className = "cell empty";
			cursor.y--;
		    this.move(cells, cursor);
		} else if (cells[cursor.y - 1][cursor.x].className.includes("enemy")) {
		    if (this.defeat()) this.move(health, dungeon, cells, cursor);  // TODO
		} else if (cells[cursor.y - 1][cursor.x].className.includes("weapon")) {
		    this.props.updateWeapon(this.props.weapons[dungeon + 1], this.props.attackValues[dungeon + 1]);
		    
		    cells[cursor.y - 1][cursor.x].className = "cell cursor";
			cells[cursor.y][cursor.x].className = "cell empty";
			cursor.y--;
		    this.move(cells, cursor);
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
			cells[cursor.y][cursor.x + 1].className = "cell cursor";
			cells[cursor.y][cursor.x].className = "cell empty";
			cursor.x++;
			this.move(cells, cursor);
		} else if (cells[cursor.y][cursor.x + 1].className.includes("health")) {
			this.props.updateHealth(health + 20);
			
			cells[cursor.y][cursor.x + 1].className = "cell cursor";
			cells[cursor.y][cursor.x].className = "cell empty";
			cursor.x++;
			this.move(cells, cursor);
		} else if (cells[cursor.y][cursor.x + 1].className.includes("enemy")) {
			if (this.defeat()) this.move(health, dungeon, cells, cursor);
		} else if (cells[cursor.y][cursor.x + 1].className.includes("weapon")) {
			this.props.updateWeapon(this.props.weapons[dungeon + 1], this.props.attackValues[dungeon + 1]);
			
			cells[cursor.y][cursor.x + 1].className = "cell cursor";
			cells[cursor.y][cursor.x].className = "cell empty";
			cursor.x++;
			this.move(cells, cursor);
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
			cells[cursor.y + 1][cursor.x].className = "cell cursor";
			cells[cursor.y][cursor.x].className = "cell empty";
			cursor.y++;
			this.move(cells, cursor);
		} else if (cells[cursor.y + 1][cursor.x].className.includes("health")) {
			this.props.updateHealth(health + 20);
			
			cells[cursor.y + 1][cursor.x].className = "cell cursor";
			cells[cursor.y][cursor.x].className = "cell empty";
			cursor.y++;
		    this.move(cells, cursor);
		} else if (cells[cursor.y + 1][cursor.x].className.includes("enemy")) {
			cells[cursor.y + 1][cursor.x].className = "cell cursor";
			cells[cursor.y][cursor.x].className = "cell empty";
			cursor.y++;
		    if (this.defeat()) this.move(health, dungeon, cells, cursor);
		} else if (cells[cursor.y + 1][cursor.x].className.includes("weapon")) {
			this.props.updateWeapon(this.props.weapons[dungeon + 1], this.props.attackValues[dungeon + 1]);
			
			cells[cursor.y + 1][cursor.x].className = "cell cursor";
			cells[cursor.y][cursor.x].className = "cell empty";
			cursor.y++;
		    this.move(cells, cursor);
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
			cells[cursor.y][cursor.x - 1].className = "cell cursor"
			cells[cursor.y][cursor.x].className = "cell empty";
			cursor.x--;
			this.move(cells, cursor);
		} else if (cells[cursor.y][cursor.x - 1].className.includes("health")) {
			this.props.updateHealth(health + 20);
			
			cells[cursor.y][cursor.x - 1].className = "cell cursor"
			cells[cursor.y][cursor.x].className = "cell empty";
			cursor.x--;
		    this.move(cells, cursor);
		} else if (cells[cursor.y][cursor.x - 1].className.includes("enemy")) {
		    if (this.defeat()) this.move(health, dungeon, cells, cursor);
		} else if (cells[cursor.y][cursor.x - 1].className.includes("weapon")) {
			this.props.updateWeapon(this.props.weapons[dungeon + 1], this.props.attackValues[dungeon + 1]);
			
			cells[cursor.y][cursor.x - 1].className = "cell cursor"
			cells[cursor.y][cursor.x].className = "cell empty";
			cursor.x--;
			this.move(cells, cursor);
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
	
	move(cells, cursor) {
	    // if (dark) moveDarkness();
		this.props.move(cells, cursor);
	}
	
	defeat() {
		console.log("defeat");
		const {dungeon} = this.props;
		let {health, attack, nextLevelPoints, level} = this.props;
		let {reward} = this.state;
		let dead = false;
		
		let myDamage = Math.floor(Math.random() * damage[dungeon] / 3) * this.getSign() + damage[dungeon];
		console.log("myDamage = " + myDamage);
		let enemyDamage = Math.floor(Math.random() * attack / 3) * this.getSign() + attack;
		console.log("enemyDamage = " + enemyDamage);
		let enemyLife = enemyLife - enemyDamage;
		console.log("enemyLife = " + enemyLife);
		if (enemyLife > 0) {
			health = health - myDamage;
		    if (health <= 0) {
		    	dead = true;
		    	console.log("dead = " + dead);
		    	// refresh();
		    	// reset();
		    }
		    // refresh();
		    return false;
		} else if (enemyLife <= 0) {
			enemyLife = 50 + dungeon * 50;
			nextLevelPoints = nextLevelPoints - reward;
		    if (nextLevelPoints === 0) {
		    	level++;
		    	// weapon bonus for fine tuning:
		    	switch (level) {
		        	case 2:
		        		attack += 78;
		        		break;
		        	case 3:
		        		attack += 64;
		        		break;
		        	case 4:
		        		attack += 128;
		        		break;
		    	}
		    	nextLevelPoints = 60 + level * 60;
		    	reward = 10 + level * 10;
		    	health += level * 20;
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































