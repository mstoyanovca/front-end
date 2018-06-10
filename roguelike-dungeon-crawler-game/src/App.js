import React, { Component } from 'react';
import Dungeon from './Dungeon';
import Header from './Header';

export default class App extends Component {
	
	render() {
		return (
			<div>
				<Dungeon />
				<Header />
			</div>
		);
	}
}
