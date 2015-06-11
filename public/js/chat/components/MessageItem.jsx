'use strict';

var React = require('react');
var _ = require('underscore');

var user = window.bootstrap.user;

var MessageItem = React.createClass({

	propTypes: {
		message: React.PropTypes.object,
		bevy: React.PropTypes.object
	},

	findMember: function(id) {
		var members = this.props.bevy.members;
		var member = _.find(members, function($member) {
			return id == $member.user;
		});
		return (member == undefined) ? {} : member;
	},

	render: function() {

		var message = this.props.message;
		var author = message.author;
		var bevy = this.props.bevy;
		var member = this.findMember(author._id);

		var direction = (author._id == user._id) ? 'row' : 'row-reverse';
		var align = (author._id == user._id) ? 'left' : 'right';
		var messageStyle = {
			//float: float
			flexDirection: direction,
			textAlign: align
		};

		var authorImage = (_.isEmpty(author.image_url)) ? '//ssl.gstatic.com/accounts/ui/avatar_2x.png' : author.image_url;
		if(bevy.settings.anonymise_users && member.image_url) {
			authorImage = member.image_url;
		}

		return (
			<div className='message-item' style={ messageStyle }>
				<a href='#' title={ author.name }>
					<img className='message-author-img' title={ author.name } alt={ author.name } src={ authorImage } />
				</a>
				<span>{ message.body }</span>
			</div>
		);
	}
});

module.exports = MessageItem;
