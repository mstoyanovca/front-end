import React, { Component } from 'react';
import './css/Header.css';
import { Button } from 'react-bootstrap';

export default class Header extends Component {

	constructor(props) {
		super(props);
		this.state = {health: 0, weapon: "stick", attack: 0, level: 0, xP: 0, dungeon: 0};
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
						<Button bsStyle="default" onClick="toggleDarkness()">Toggle Darkness</Button>
					</div>
				</div>
			</div>
		);
	}
}
