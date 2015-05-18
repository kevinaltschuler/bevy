/**
 * BevyList.jsx
 *
 * List of bevies
 *
 * @author albert
 */

'use strict';

// imports
var React = require('react');

var rbs = require('react-bootstrap');
var Badge = rbs.Badge;
var Button = rbs.Button;
var ButtonGroup = rbs.ButtonGroup;
var ModalTrigger = rbs.ModalTrigger;

var mui = require('material-ui');
var FontIcon = mui.FontIcon;
var FlatButton = mui.FlatButton;

var CreateNewBevy = require('./CreateNewBevy.jsx');

var BevyActions = require('./../BevyActions');

var BevyList = React.createClass({

	propTypes: {
		allBevies: React.PropTypes.array.isRequired,
		activeBevy: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {};
	},

	switchBevy: function(ev) {
		// get the bevy id
		var id = ev.target.getAttribute('id') || null;
		// call action
		BevyActions.switchBevy(id);
	},

	render: function() {
		var allBevies = this.props.allBevies;
		var bevies = [];

		for(var key in allBevies) {
			var bevy = allBevies[key];
			var className = 'bevy-btn';
			if(bevy._id == this.props.activeBevy.id) className += ' active';

			bevies.push(
				<Button
					key={ bevy._id }
					id={ bevy._id }
					type="button"
					className={ className }
					onClick={ this.switchBevy }
				>
					{ bevy.name }
				</Button>
			);
		}

		return <div>
					<div className='panel-header'>
						<p>Bevies</p>
					</div>
					<ButtonGroup className='bevy-list' role="group">
						<text>
							{bevies}
							<ModalTrigger modal={
								<CreateNewBevy	/>
							}>
								<button className='bevy-btn new-bevy-btn'>
									<FontIcon className="glyphicon glyphicon-plus"/> &nbsp;
									<span className="mui-flat-button-label">Create New Bevy</span>
								</button>
							</ModalTrigger>
						</text>
					</ButtonGroup>
				 </div>;
	}

});

module.exports = BevyList;
