import React from 'react';
import { Button, Modal } from 'react-bootstrap';

export default class LossModal extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.close = this.close.bind(this);
		this.state = { show: this.props.show };
	}

	close() {
		this.setState({ show: false });
		this.props.startNewGame();
	}
	
	componentWillReceiveProps(nextProps) {
		if (nextProps.show === true) this.setState({show: true});
	} 

	render() {
		return (
			<div>
				<Modal show={this.state.show} onHide={this.close} bsSize="small">
					<Modal.Body>
					<h4 className="text-center">
						You lost! Try again.
					</h4>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.close}>OK</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}
