import React, {Component} from 'react';
import {PageHeader, Navbar, Nav, NavDropdown, MenuItem, NavItem, Well} from 'react-bootstrap';

var link = "https://www.math.cornell.edu/~lipa/mec/lesson6.html";

export class GameNavBar extends React.Component {
	
	handleSelect(selectedKey) {
	    switch (selectedKey) {
	        case 1.1:
	            this.props.changeSize(50, 30);
	            break;
	        case 1.2:
	        	this.props.changeSize(70, 50);
	        	break;
	        case 1.3:
	        	this.props.changeSize(100, 80);
	        	break;
	        case 1.4:
	        	this.props.changeSpeed(200);  // slow
	        	break;
	        case 1.5:
	        	this.props.changeSpeed(100);  // medium
	        	break;
	        case 1.6:
	        	this.props.changeSpeed(50);  // fast
	        	break;
	        case 2:
	        	this.props.isPause(false);
	        	this.props.play();  // run
	        	break;
	        case 3:
	        	this.props.isPause(true);  // pause
	        	break;
	        case 4:
	        	this.props.clear();  // clear
	        	break;
	        default:
	        	console.log("Error");
	    	}
	}
	
	render() {
	    return (
	    	<Navbar>
	    	    <Navbar.Header>
	    		    <Navbar.Brand>
	    	            <a href={link} target="_blank">Game of Life</a>
	    	        </Navbar.Brand>
	    	    </Navbar.Header>
	    	    <Nav onSelect={e => this.handleSelect(e)}>
	    	        <NavDropdown eventKey={1} id="dropdown" title="Options">
	    	            <MenuItem eventKey={1.1}>Size: 30x50</MenuItem>
	    	            <MenuItem eventKey={1.2}>Size: 50x70</MenuItem>
	    	            <MenuItem eventKey={1.3}>Szie: 80x100</MenuItem>
	    	            <MenuItem divider />
	    	            <MenuItem eventKey={1.4}>Speed: Slow</MenuItem>
	    	            <MenuItem eventKey={1.5}>Speed: Medium</MenuItem>
	    	            <MenuItem eventKey={1.6}>Speed: Fast</MenuItem>
	    	        </NavDropdown>
	    	        <NavItem eventKey={2} href="#"><span className="glyphicon glyphicon-play" aria-hidden="true">Run</span></NavItem>
	    	        <NavItem eventKey={3} href="#"><span className="glyphicon glyphicon-pause" aria-hidden="true">Pause</span></NavItem>
	    	        <NavItem eventKey={4} href="#"><span className="glyphicon glyphicon-stop" aria-hidden="true">Clear</span></NavItem>
	    	        <NavItem eventKey={5} href="#">Generation: {this.props.generation}</NavItem>
	    	    </Nav>
	    	</Navbar>
	    );
	}
}