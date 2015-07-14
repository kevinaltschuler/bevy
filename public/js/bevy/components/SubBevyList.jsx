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

var router = require('./../../router');

var rbs = require('react-bootstrap');
var Badge = rbs.Badge;
var Button = rbs.Button;
var ButtonGroup = rbs.ButtonGroup;
var ModalTrigger = rbs.ModalTrigger;
var Tooltip = rbs.Tooltip;
var OverlayTrigger = rbs.OverlayTrigger;

var mui = require('material-ui');
var FontIcon = mui.FontIcon;
var FlatButton = mui.FlatButton;

var CreateNewBevy = require('./CreateNewBevy.jsx');

var BevyActions = require('./../BevyActions');

var SubBevyList = React.createClass({

	propTypes: {
		myBevies: React.PropTypes.array.isRequired,
		activeBevy: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {};
	},

	switchBevy: function(ev) {
		ev.preventDefault();
		// get the bevy id
		var id = ev.target.getAttribute('id') || null;
		if(id == -1) id = 'frontpage';
		// call action
		router.navigate('/b/' + id, { trigger: true });
	},

	render: function() {
		var myBevies = this.props.myBevies;
		var bevies = [];

		for(var key in myBevies) {
			var bevy = myBevies[key];
			var className = 'bevy-btn';
			if(bevy._id == this.props.activeBevy.id) className += ' active';

			if(bevy.parent == this.props.activeBevy) {
				bevies.push(
					<SubBevyList
						key={ bevy._id }
						id={ bevy._id }
						type="button"
						className={ className }
						onClick={ this.switchBevy } >
						{ bevy.name }
					</SubBevyList>
				);
			}
		}

		var superBevy = this.props.activeBevy;

		return (
			<div className='bevy-list'>
				<div className='panel-header'>
					<Button
						key={ superBevy._id }
						id={ superBevy._id }
						type="button"
						className='super-bevy-btn'
						onClick={ this.switchBevy } 
					>
						{superBevy.name}
					</Button>
					<ModalTrigger modal={
						<CreateNewBevy parent={this.props.activeBevy}/>
					}>
						<OverlayTrigger placement='bottom' overlay={ <Tooltip>Create a New Bevy</Tooltip> }>
							<Button className='new-bevy-btn'>
								<FontIcon className="glyphicon glyphicon-plus"/>
							</Button>
						</OverlayTrigger>
					</ModalTrigger>
				</div>
				<ButtonGroup className='bevy-list-btns' role="group">
					{bevies}
				</ButtonGroup>
			</div>
		);
	}

});

module.exports = SubBevyList;
