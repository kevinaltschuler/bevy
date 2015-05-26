/**
 * ImageModal.jsx
 *
 * @author kevin
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var rbs = require('react-bootstrap');
var Modal = rbs.Modal;
var Button = rbs.Button;

var mui = require('material-ui');
var IconButton = mui.IconButton;

var ImageModal = React.createClass({

	propTypes: {
		allImages: React.PropTypes.array.isRequired,
		index: React.PropTypes.number.isRequired
	},

	getInitialState: function() {
		return {
			isModalOpen: false,
			index: this.props.index
		};
 	},

 	componentWillMount: function() {
 		this.setState({
 			index: this.props.index
 		});
 	},

 	// triggered every time a key is pressed
	// updates the state
	handleChange: function() {
	},

	onLeft: function(ev) {
		if(this.state.index == 0) {
			this.setState({
				index: this.props.allImages.length - 1
			});
		} else {
			this.setState({
				index: --this.state.index
			});
		}
	},

	onRight: function(ev) {
		if(this.state.index == this.props.allImages.length - 1) {
			this.setState({
				index: 0
			});
		} else {
			this.setState({
				index: ++this.state.index
			});
		}
	},

	render: function() {

		var url = this.props.allImages[this.state.index];

		var scrollButtons = (this.props.allImages.length < 2)
		? ''
		: (
			<div>
				<IconButton iconClassName="glyphicon glyphicon-chevron-left" className='image-left-btn' onClick={ this.onLeft }/>
				<IconButton iconClassName="glyphicon glyphicon-chevron-right" className='image-right-btn' onClick={ this.onRight } />
			</div>
		);

		return (
			<Modal
				{...this.props}
				title=" "
				className="image-modal" >

				<div className='modal-body'>
					<img src={ this.props.allImages[this.state.index] }/>
				</div>

				{ scrollButtons }

			</Modal>
		);
	}
});

module.exports = ImageModal;
