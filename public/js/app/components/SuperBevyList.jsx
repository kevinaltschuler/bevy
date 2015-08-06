/**
 * SuperBevyList.jsx.jsx
 * formerly money.jsx
 *
 * @author kevin
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var constants = require('./../../constants');

var rbs = require('react-bootstrap');
var Badge = rbs.Badge;
var ButtonGroup = rbs.ButtonGroup;
var MenuItem = rbs.MenuItem;
var Accordion = rbs.Accordion;
var Panel = rbs.Panel;
var Button = rbs.Button;
var Input = rbs.Input;
var ModalTrigger = rbs.ModalTrigger;
var TabbedArea = rbs.TabbedArea;
var TabPane = rbs.TabPane;

var mui = require('material-ui');
var DropDownMenu = mui.DropDownMenu;
var IconButton = mui.IconButton;
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;
var FlatButton = mui.FlatButton;

var SuperBevyList = React.createClass({

	propTypes: {
	},

	render: function() {

		var postContent = (
				<div className='actions'>

				</div>
			);
		var bevyContent = (
				<div className='actions'>

				</div>
			);
		return (
			<div className="bevy-panel panel">
				 sorts
			</div>
		);
	}
});
module.exports = SuperBevyList;
