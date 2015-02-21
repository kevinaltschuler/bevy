'use strict';

var React = require('react');

var rbs = require('react-bootstrap');
var Panel = rbs.Panel;
var Input = rbs.Input;
var Button = rbs.Button;

var mui = require('material-ui');
var IconButton = mui.IconButton;

var CreateNewBevy = React.createClass({
	render: function() {
		return	<Panel className="login-panel">
						<div className="panel-heading">
							Create New Bevy
						</div>
						<Input type="text" placeholder="Group Name" />
	  					<Input type="text" placeholder="Add Members" />
						<div className="panel-bottom">
							<Button>Cancel</Button>
							<Button className="create-button">Create</Button>
						</div>
				</Panel>
	}
});

module.exports = CreateNewBevy;