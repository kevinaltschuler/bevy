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
var OverlayMixin = rbs.OverlayMixin;

var mui = require('material-ui');
var FlatButton = mui.FlatButton;
var IconButton = mui.IconButton;

var NotificationList = require('./NotificationList.jsx');
var NotificationActions = require('./../NotificationActions');

var user = window.bootstrap.user;
var email = user.email;

var ProfileDropdown = React.createClass({

	//mixins: [OverlayMixin],

	propTypes: {
		allNotifications: React.PropTypes.array,
	},

	getInitialState: function() {
		return {
			isOverlayOpen: false
		};
	},

	dismissAll: function(ev) {
		ev.preventDefault();
		var allNotifications = this.props.allNotifications;
		for(var key in allNotifications) {
			var notification = allNotifications[key];
			NotificationActions.dismiss(notification._id);
		}
  	},

  	handleToggle: function(ev) {
  		ev.preventDefault();
  		this.setState({
  			isOverlayOpen: !this.state.isOverlayOpen
  		});
  	},

  	renderOverlay: function() {
  		if(!this.state.isOverlayOpen) return <span />

  		var notifications = this.props.allNotifications;

  		return (
  			<div>
				<div className='notification-backdrop' onClick={ this.handleToggle } />
				<Popover className="notification-dropdown" placement='bottom'>
					<div className="title">
						Notifications
						<IconButton iconClassName="glyphicon glyphicon-minus" tooltip='clear all' onClick={this.dismissAll}/>
					</div>
					<NotificationList
						allNotifications={ notifications }
					/>
				</Popover>
			</div>
		);
  	},

	render: function() {

		return (
			<div>
				<Button className="notification-dropdown-btn" onClick={ this.handleToggle }>
					<img src="./../../img/notification-icon.png"/>
				</Button>
				{ this.renderOverlay() }
			</div>
		);
	}
});
module.exports = ProfileDropdown;
