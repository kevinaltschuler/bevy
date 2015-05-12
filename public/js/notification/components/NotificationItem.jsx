/**
 * NotificationItem.jsx
 *
 * @author KEVIN
 * @author albert
 */

var React = require('react');
var $ = require('jquery');

var rbs = require('react-bootstrap');
var ButtonGroup = rbs.ButtonGroup;
var Button = rbs.Button;
var Panel = rbs.Panel;

var NotificationActions = require('./../NotificationActions');
var BevyActions = require('./../../bevy/BevyActions');

var user = window.bootstrap.user;

var NotificationItem = React.createClass({

	propTypes: {
		id: React.PropTypes.string,
		event: React.PropTypes.string,
		data: React.PropTypes.object,
	},

	dismiss: function(ev) {
		ev.preventDefault();
		NotificationActions.dismiss(this.props.id);
	},

	join: function(ev) {
		ev.preventDefault();

		var data = this.props.data;
		var bevy_id = data.bevy._id;
		var email = user.email;
		var user = window.bootstrap.user;

		BevyActions.join(bevy_id, user, email);
	},

	render: function() {

		var event = this.props.event;
		var data = this.props.data;
		var defaultNotificationImage = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';

		var body;

		switch(event) {
			case 'invite':
				var bevy = data.bevy;
				var from_user = data.from_user;

				body = <div>
						 	Invite to { bevy.name } from { from_user.google.name.givenName }
						 	<br />
						 	<Button
						 		onClick={ this.join }
						 	>
						 		Join
						 	</Button>
						 </div>

				break;
		}

		return <Panel className="notification-item">
					<div className='row'>
						<div className='col-xs-8'>

						</div>
						<div className='col-xs-4'>
							<Button
								onClick={ this.dismiss }>
								Dismiss
							</Button>
						</div>
					</div>
					<div className='notification-body'>
				 		{ body }
				 	</div>
				 </Panel>
	}
});
module.exports = NotificationItem;
