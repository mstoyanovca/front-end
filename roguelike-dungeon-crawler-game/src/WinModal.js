import React from 'react';
import { Button, Modal } from 'react-bootstrap';

export default class LostModal extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.close = this.close.bind(this);
		this.state = { show: this.props.show };
	}

	close() {
		this.setState({ show: false });
		this.props.reset();
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
						You won!
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
