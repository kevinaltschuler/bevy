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

	render: function() {

		var event = this.props.event;
		var data = this.props.data;
		var defaultNotificationImage = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';

		var body;

		switch(event) {
			case 'invite':
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

				/*var post = data.post;
				var authorName = (post.author.google)
				? post.author.google.name.givenName + ' ' + post.author.google.name.familyName
				: post.author.email;
				var bevyName = post.bevy.name;*/

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
