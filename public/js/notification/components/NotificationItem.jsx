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
		var bevy_id = data.bevy_id;
		var email = user.email;

		BevyActions.join(bevy_id, window.bootstrap.user, email);
		//BevyActions.switchBevy();
	},

	acceptJoin: function(ev) {
		ev.preventDefault();

		var data = this.props.data;
		var bevy_id = data.bevy_id;
		var user_id = data.user_id;
		var user_email = data.user_email;

		BevyActions.addUser(bevy_id, user_id, user_email);
	},

	render: function() {

		var event = this.props.event;
		var data = this.props.data;
		var defaultNotificationImage = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';

		var body;

		switch(event) {
			case 'invite:email':
				//var bevy = data.bevy;
				//var from_user = data.from_user;
				var bevy_name = data.bevy_name;
				var bevy_img = data.bevy_img;
				var inviter_name = data.inviter_name;

				body = <div className="notification-body">
							<div className="col-xs-3 sidebar-picture">
								<img src={ bevy_img }/>
							</div>
							<div className="col-xs-5">
								<div className="row">
									<div className="name">
										{ inviter_name }
									</div>
								</div>
								<div className="row">
									<div className="content">
										Invite to { bevy_name }
									</div>
								</div>
							</div>
							<div className='col-xs-2'>
							 	<Button
							 		className="accept-btn"
									onClick={ this.join } >
							 		Join
							 	</Button>
							</div>
						</div>

				break;

			case 'post:create':

				var author_name = data.author_name;
				var author_img = data.author_img;
				var bevy_name = data.bevy_name;
				var post_title = data.post_title;

				body = (
					<div className="notification-body col-xs-10">
						<span>Post to <b>{ bevy_name }</b> by <b>{ author_name }</b></span>
						<br />
						<span><i>{ post_title }</i></span>
					</div>
				);

				break;

			case 'bevy:requestjoin':

				var user_id = data.user_id;
				var user_name = data.user_name;
				var user_image = data.user_image;
				var bevy_id = data.bevy_id;
				var bevy_name = data.bevy_name;

				body = (
					<div className='notification-body'>
						<div className='col-xs-2 sidebar-picture'>
							<img src={ user_image } />
						</div>
						<div className='col-xs-6'>
							<div className='row'>
								<span>Request to join <b>{ bevy_name }</b></span>
							</div>
							<div className='row'>
								<span>From <i>{ user_name }</i></span>
							</div>
						</div>
						<div className='col-xs-2'>
							<Button
								className="accept-btn"
								onClick={ this.acceptJoin } >
								Accept
							</Button>
						</div>
					</div>
				);

				break;

			case 'post:reply':

				var author_name = data.author_name;
				var author_image = data.author_image;
				var post_title = data.post_title;
				var bevy_name = data.bevy_name;

				body = (
					<div className='notification-body'>
						<div className='col-xs-9'>
							<b>{ author_name }</b> replied to your post <i>{ post_title }</i> in <b>{ bevy_name }</b>
						</div>
					</div>
				);

				break;

			case 'post:commentedon':

				var author_name = data.author_name;
				var author_image = data.author_image;
				var post_title = data.post_title;
				var bevy_name = data.bevy_name;

				body = (
					<div className='notification-body'>
						<div className='col-xs-9'>
							<b>{ author_name }</b> commented on a post you commented on
						</div>
					</div>
				);

				break;

			default:
				body = (
					<span>{ data }</span>
				);
				break;
		}

		return <Panel className="notification-item">
					<div className='row'>
						{ body }

						<div className='col-xs-2 dismiss-btn'>
							<IconButton onClick={ this.dismiss } tooltip='dismiss' >
								<span className="glyphicon glyphicon-remove" />
							</IconButton>
						</div>
					</div>
				 </Panel>
	}
});
module.exports = NotificationItem;
