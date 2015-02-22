'use strict';

var React = require('react');

var rbs = require('react-bootstrap');
var Badge = rbs.Badge;
var ButtonGroup = rbs.ButtonGroup;
var MenuItem = rbs.MenuItem;
var Accordion = rbs.Accordion;
var Panel = rbs.Panel;

var NotificationHeader = 

module.exports = React.createClass({
	render: function() {
		return	<ButtonGroup className="col-sm-2 hidden-xs btn-group right-sidebar">
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
