'use strict';

var React = require('react');
var _ = require('underscore');

var rbs = require('react-bootstrap');
var OverlayTrigger = rbs.OverlayTrigger;
var Tooltip = rbs.Tooltip;

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

		var isMe = (author._id == user._id);

		var messageStyle = {
			//float: float
			flexDirection: (isMe) ? 'row-reverse' : 'row',
			textAlign: (isMe) ? 'right' : 'left'
		};
		var bodyStyle = {
			justifyContent: (isMe) ? 'flex-end' : 'flex-start',
			alignItems: (isMe) ? 'flex-end' : 'flex-start'
		}

		var arrowStyle = {
			borderLeft: (isMe) ? '10px solid white' : 'none',
			borderRight: (isMe) ? 'none' : '10px solid white'
		};
		var messageTextStyle = {
			borderRadius: (isMe) ? '3px 0px 3px 3px' : '0px 3px 3px 3px'
		};

		var authorImage = (_.isEmpty(author.image_url)) ? '//ssl.gstatic.com/accounts/ui/avatar_2x.png' : author.image_url;
		if(bevy.settings.anonymise_users && member.image_url) {
			authorImage = member.image_url;
		}

		var authorName = author.displayName;
		if(bevy.settings.anonymise_users) {
			authorName = member.displayName;
		}

		var createDate = new Date(message.created);
		var dateOptions = {
			year: undefined,
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		};
		if(new Date(Date.now()).getDay() == createDate.getDay()) {
			dateOptions.month = undefined;
			dateOptions.day = undefined;
		}
		var created = createDate.toLocaleString('en-US', dateOptions);

		return (
			<div className='message-item' style={ messageStyle }>
				<img className='message-author-img' title={ authorName } alt={ authorName } src={ authorImage } />
				<div className='arrow' style={ arrowStyle }/>
				<div>
					<div className='message-body' style={ bodyStyle }>
						<span title={ created } className='message-text' style={ messageTextStyle }>{ message.$body }</span>
					</div>
					<span className='message-info'>{ authorName }</span>
				</div>
			</div>
		);
	}
});

module.exports = MessageItem;
