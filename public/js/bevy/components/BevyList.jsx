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
var ReactPropTypes = React.PropTypes;

var rbs = require('react-bootstrap');
var Badge = rbs.Badge;
var Button = rbs.Button;
var ButtonGroup = rbs.ButtonGroup;
var ModalTrigger = rbs.ModalTrigger;

var mui = require('material-ui');
var IconButton = mui.IconButton;

var CreateNewBevy = require('./../../modals/components/CreateNewBevy.jsx');

var BevyActions = require('./../BevyActions');

var BevyList = React.createClass({

	propTypes: {
		  allBevies: ReactPropTypes.array.isRequired
		, activeBevy: ReactPropTypes.object.isRequired
	},

	getInitialState: function() {
		return {};
	},

	switchBevy: function(ev) {
		// get the bevy id
		var id = ev.target.getAttribute('id');
		// call action
		BevyActions.switchBevy(id);
	},

	render: function() {
		var allBevies = this.props.allBevies;
		var bevies = [];

		//bevies.push(<Button key='0' type='button' className='bevy-btn'>Front Page</Button>)
		for(var key in allBevies) {
			var bevy = allBevies[key];
			var className = 'bevy-btn';
			if(bevy._id == this.props.activeBevy.id) className += ' active';

			bevies.push(<Button key={ bevy._id } id={ bevy._id } type="button" className={ className }
				onClick={ this.switchBevy }>{ bevy.name }</Button>);
		}

		return	<div className='panel'>
						<div className='panel-header'>
							<p>Bevies</p>
						</div>
						<ButtonGroup className='bevy-list' role="group">
							<text>
								{bevies}
								<ModalTrigger modal={<CreateNewBevy />}>
									<IconButton iconClassName="glyphicon glyphicon-plus" tooltip="Create new bevy"/>
								</ModalTrigger>
							</text>
						</ButtonGroup>
					</div>;
	}

});

module.exports = BevyList;
