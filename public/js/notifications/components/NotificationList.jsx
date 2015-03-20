/**
 * NotificationList.jsx
 *
 * @author KEVIN
 */

'use strict';

var React = require('react');

var rbs = require('react-bootstrap');
var ButtonGroup = rbs.ButtonGroup;

var NotificationItem = require('./NotificationItem.jsx');

var user = window.bootstrap.user;
console.log(user);

var NotificationList = React.createClass({

	render: function() {

		return <div>
				 	<NotificationItem />
				 </div>
	}
});
module.exports = NotificationList;
