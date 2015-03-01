'use strict';

var React = require('react');
var ReactPropTypes = React.PropTypes;
var _ = require('underscore');

var rbs = require('react-bootstrap');
var Badge = rbs.Badge;
var ButtonGroup = rbs.ButtonGroup;
var MenuItem = rbs.MenuItem;
var Accordion = rbs.Accordion;
var Panel = rbs.Panel;

var NotificationHeader =

module.exports = React.createClass({

	propTypes: {
		activeBevy: ReactPropTypes.object
	},

	render: function() {

		var bevyName = (_.isEmpty(this.props.activeBevy)) ? 'not in a bevy' : this.props.activeBevy.get('name');

		return	<ButtonGroup className="col-sm-2 hidden-xs btn-group right-sidebar">
						<p>current bevy: { bevyName }</p>
						<Accordion className="dropdown-button" title='Notifications'>
							<Panel header="Notifications" eventKey='1'>
								• 'Josh Guererro commented on your post "Owl Spreading its wings'
								<br/>

							</Panel>
						</Accordion>
						<Accordion className="dropdown-button" title='Invites'>
							<Panel header="Invites" eventKey='1'>

							</Panel>
						</Accordion>
					</ButtonGroup>;
	}
});
