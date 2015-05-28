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
var IconButton = mui.IconButton;

var NotificationList = require('./NotificationList.jsx');
var NotificationActions = require('./../NotificationActions');

var user = window.bootstrap.user;
var email = user.email;

var ProfileDropdown = React.createClass({

	propTypes: {
		allNotifications: React.PropTypes.array,
	},

	dismissAll: function(ev) {
		ev.preventDefault();
		var allNotifications = this.props.allNotifications;
		for(var key in allNotifications) {
			var notification = allNotifications[key];
			NotificationActions.dismiss(notification._id);
		}
  	},

	render: function() {

		var overlay = (user.notifications.length <= 0)
		? (<Tooltip><strong>No new notifications!</strong></Tooltip>)
		: (<Popover className="notification-dropdown" disableOnClickOutside={false}>
		 		<div className="title">
		 			Notifications
		 			<IconButton iconClassName="glyphicon glyphicon-minus" tooltip='clear all' onClick={this.dismissAll}/>
		 		</div>
				<NotificationList
					allNotifications={ this.props.allNotifications }
				/>
			</Popover>)

		var trigger = (user.notifications.length <= 0)
		? 'hover'
		: 'click';

		return <OverlayTrigger ref="trigger" trigger={trigger} placement="bottom" overlay={ overlay }>
				 	<Button className="notification-dropdown-btn">
					 	<img src="./../../img/notification-icon.png"/>
				 	</Button>
				 </OverlayTrigger>;
	}
});
module.exports = ProfileDropdown;
