'use strict';

var React = require('react');

var rbs = require('react-bootstrap');
var Panel = rbs.Panel;
var Input = rbs.Input;
var Button = rbs.Button;
var Modal = rbs.Modal;

var mui = require('material-ui');
var FlatButton = mui.FlatButton;
var RaisedButton = mui.RaisedButton;

var CreateNewBevy = React.createClass({
	render: function() {
		return	<Modal className="login-panel" {...this.props} title="Create a New Bevy">
						<Input type="text" placeholder="Group Name" />
	  					<Input type="text" placeholder="Add Members..." />
						<div className="panel-bottom">
							<RaisedButton label="Create"/>
							<FlatButton label="Cancel"/>
						</div>
				</Modal>
	}
});

module.exports = CreateNewBevy;