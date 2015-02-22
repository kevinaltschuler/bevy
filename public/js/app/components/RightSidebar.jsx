'use strict';

var React = require('react');

var rbs = require('react-bootstrap');
var Badge = rbs.Badge;
var ButtonGroup = rbs.ButtonGroup;
var MenuItem = rbs.MenuItem;
var Accordion = rbs.Accordion;

module.exports = React.createClass({
	render: function() {
		return	<ButtonGroup className="col-sm-2 hidden-xs btn-group right-sidebar">
						<Accordion className="dropdown-button" title='Notifications'>
							<MenuItem eventKey="1">Action</MenuItem>
						</Accordion>
						<Badge>2</Badge>
						<br/>
						<Accordion className="dropdown-button" title='Invites'>
							<MenuItem eventKey="1">Action</MenuItem>
						</Accordion>
				</ButtonGroup>;
	}
});
