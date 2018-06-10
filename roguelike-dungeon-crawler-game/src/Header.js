import React, { Component } from 'react';
import './css/Header.css';
import { Button } from 'react-bootstrap';

var weapons = ["stick", "brass knuckles", "serrated dagger", "katana", "reaper's scythe", "large trout"];
//tune the game here; you need 240 health points to beet the boss:
var attackValues = [7, 26, 64, 88, 200, 300];  // per dungeon/weapon
// xP - next level points; add 60 for each level;

export default class Header extends Component {

	constructor(props) {
		super(props);
		this.state = {health: 100, weapon: weapons[0], attack: attackValues[0], level: 0, xP: 0, dungeon: 0};
	}
	
	toggleDarkness() {
		/*dark = !dark;
		if (dark) {
			for (var i = 0; i < boardWidth; i++) {
				for (var j = 0; j < boardHeight; j++) {
					if (Math.abs(cursorX - cell[i][j].column) > 6 || Math.abs(cursorY - cell[i][j].row) > 6) {
						cell[i][j].class += " cell-dark";
					}
				}
		    }
		} else {
			for (var i = 0; i < boardWidth; i++) {
				for (var j = 0; j < boardHeight; j++) {
					cell[i][j].class = cell[i][j].class.replace("cell-dark", "").trim();
				}
		    }
		}*/
	}
	
	render() {
		return (
			<div>
				<div className="sticky">
					<h2 className="text-center">React Roguelike</h2>
					<h4 className="text-center">Kill the boss in dungeon 4</h4>
					<div className="status-bar text-center">
						<span><b>Health:</b> {this.state.health}</span>
						<span><b>Weapon:</b> {this.state.weapon}</span>
						<span><b>Attack:</b> {this.state.attack}</span>
						<span><b>Level:</b> {this.state.level}</span>
						<span><b>Next Level:</b> {this.state.xP} XP</span>
						<span><b>Dungeon:</b>d {this.state.dungeon}</span>
						<Button bsStyle="default" onClick={this.toggleDarkness()}>Toggle Darkness</Button>
					</div>
				</div>
			</div>
		);
	}
}
