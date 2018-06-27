import React, { Component } from 'react';
import './css/Header.css';
import { Button } from 'react-bootstrap';

export default class Header extends Component {
	
	constructor(props) {
		super(props);
	    this.state = {dark: false};
	    this.toggleDarkness = this.toggleDarkness.bind(this);
	}
	
	componentDidMount() {
		window.addEventListener('button-click', this.toggleDarkness);
	}

	toggleDarkness() {
		let dark = !this.state.dark;
		let cells = this.props.cells;
		let cursor = this.props.cursor;
		
		if (dark) {
			cells.forEach(row => row.filter(cell => Math.abs(cursor.x - cell.column) > 6 || Math.abs(cursor.y - cell.row) > 6).forEach(cell => cells[cell.row][cell.column].className += " dark"));
		} else {
			cells.forEach(row => row.forEach(cell => cell.className = cell.className.replace("dark", "").trim()));
		}
		
		this.setState({dark: dark});
		this.props.updateCells(cells);
	}
	
	render() {
		return (
			<div>
				<div className="sticky">
					<h2 className="text-center">React Roguelike</h2>
					<h4 className="text-center">Kill the boss in dungeon 4</h4>
					<div className="status-bar text-center">
						<span><b>Health: </b>{this.props.health}</span>
						<span><b>Weapon: </b>{this.props.weapon}</span>
						<span><b>Attack: </b>{this.props.attack}</span>
						<span><b>Level: </b>{this.props.level}</span>
						<span><b>XP: </b>{this.props.nextLevelPoints}</span>
						<span><b>Dungeon: </b>{this.props.dungeon}</span>
						<Button bsStyle="default" onClick={this.toggleDarkness}>Toggle Darkness</Button>
					</div>
				</div>
			</div>
		);
	}
}
