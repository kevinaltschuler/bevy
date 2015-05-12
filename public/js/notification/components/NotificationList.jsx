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
//console.log(user);

var NotificationList = React.createClass({

	propTypes: {
		allNotifications: React.PropTypes.array,
		activeAlias: React.PropTypes.object
	},

	render: function() {

		var allNotifications = this.props.allNotifications;

		if(allNotifications.length < 1) {
			return <div>
					 	No Notifications!
					 </div>
		}

		var notifications = [];
		for(var key in allNotifications) {
			var notification = allNotifications[key];
			var id = notification._id || Date.now();
			var event = notification.event;
			var data = notification.data;

			notifications.push(
				<NotificationItem
					key={ id }
					id={ id }
					event={ event }
					data={ data }
					activeAlias={ this.props.activeAlias }
				/>
			);
		}

		return <div>
				 	{ notifications }
				 </div>
	}
});
module.exports = NotificationList;
