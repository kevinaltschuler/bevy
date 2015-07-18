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

var SubBevyPanel = React.createClass({

	propTypes: {
		myBevies: React.PropTypes.array.isRequired,
		activeBevy: React.PropTypes.object.isRequired,
		superBevy: React.PropTypes.object.isRequired,
		subBevies: React.PropTypes.array.isRequired
	},

	getInitialState: function() {
		return {};
	},

	switchBevy: function(ev) {
		ev.preventDefault();
		// get the bevy id
		var id = ev.target.getAttribute('id') || null;
		if(id == -1) id = 'frontpage';
		if(id == this.props.superBevy._id) {
			router.navigate('/b/' + this.props.superBevy._id, { trigger: true });
		} else {
			router.navigate('/b/' + this.props.superBevy._id + '/' + id, { trigger: true });
		}	
	},

	render: function() {
		var subBevies = this.props.subBevies;
		var superBevy = this.props.superBevy;

		var bevies = [];
		bevies.push(
			<Button
				key={ superBevy._id }
				id={ superBevy._id }
				type="button"
				className='bevy-btn'
				onClick={ this.switchBevy } >
				{ superBevy.name }
			</Button>
		);
		if(subBevies.length > 0) {
			for(var key in subBevies) {
				var bevy = subBevies[key];
				var className = 'bevy-btn';
				if(bevy._id == this.props.activeBevy.id) className += ' active';

					bevies.push(
						<Button
							key={ bevy._id }
							id={ bevy._id }
							type="button"
							className={ className }
							onClick={ this.switchBevy } >
							{ bevy.name }
						</Button>
					);
			}
		}

		return (
			<div className='bevy-list panel'>
				<div className='panel-header'>
					<div className='super-bevy-btn'>
						sub bevies
					</div>
					<ModalTrigger modal={
						<CreateNewBevy parent={this.props.superBevy}/>
					}>
						<OverlayTrigger placement='bottom' overlay={ <Tooltip>New Sub Bevy</Tooltip> }>
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

module.exports = SubBevyPanel;
