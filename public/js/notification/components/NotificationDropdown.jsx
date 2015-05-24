/**
 * Notification.jsx
 *
 * @author KEVIN
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var rbs = require('react-bootstrap');
var OverlayTrigger = rbs.OverlayTrigger;
var ModalTrigger = rbs.ModalTrigger;
var Button = rbs.Button;
var Popover = rbs.Popover;
var ButtonGroup = rbs.ButtonGroup;
var Tooltip = rbs.Tooltip;

var mui = require('material-ui');
var FlatButton = mui.FlatButton;

var NotificationList = require('./NotificationList.jsx');

var user = window.bootstrap.user;
var email = user.email;

var ProfileDropdown = React.createClass({

	propTypes: {
		allNotifications: React.PropTypes.array,
	},

	render: function() {

		var overlay = (user.notifications.length <= 0)
		? (<Tooltip><strong>No new notifications!</strong></Tooltip>)
		: (<Popover className="notification-dropdown">
		 		<div className="title">
		 			Notifications
		 		</div>
				<NotificationList
					allNotifications={ this.props.allNotifications }
				/>
			</Popover>)

		var trigger = (user.notifications.length <= 0)
		? 'hover'
		: 'click';

		return <OverlayTrigger trigger={ trigger } placement="bottom" overlay={ overlay }>
				 	<Button className="notification-dropdown-btn">
					 	<img src="./../../img/notification-icon.png"/>
				 	</Button>
				 </OverlayTrigger>;
	}
});
module.exports = ProfileDropdown;
