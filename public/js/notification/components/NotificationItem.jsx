/**
 * NotificationItem.jsx
 *
 * @author KEVIN
 * @author albert
 */

var React = require('react');
var $ = require('jquery');
var _ = require('underscore');

var rbs = require('react-bootstrap');
var ButtonGroup = rbs.ButtonGroup;
var Button = rbs.Button;
var Panel = rbs.Panel;

var mui = require('material-ui');
var IconButton = mui.IconButton;

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

		BevyActions.join(bevy_id, window.bootstrap.user, email);
		//BevyActions.switchBevy();
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

				var bevyImage = (_.isEmpty(bevy.image_url)) ? defaultNotificationImage : bevy.image_url;

				body = <div className="notification-body">
							<div className="col-xs-3 sidebar-picture">
								<img src={ bevyImage }/>
							</div>
							<div className="col-xs-5">
								<div className="row">
									<div className="name">
										{ from_user.google.name.givenName + " " }
										
										{ from_user.google.name.familyName }
									</div>
								</div>
								<div className="row">
									<div className="content">
										Invite to { bevy.name }
									</div>
								</div>
							</div>
						</div>

				break;
		}

		return <Panel className="notification-item">
					<div className='row'>
						{ body }
						<div className='col-xs-2'>
						 	<Button
						 		className="accept-btn"
								onClick={ this.join }
							>
						 		Join
						 	</Button>
						</div>
						<div className='col-xs-1 dismiss-btn'>
							<IconButton onClick={ this.dismiss } tooltip='dismiss' >
								<span className="glyphicon glyphicon-remove" />
							</IconButton>
						</div>
					</div>
				 </Panel>
	}
});
module.exports = NotificationItem;
