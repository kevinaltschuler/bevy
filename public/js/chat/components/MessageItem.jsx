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

		var direction = (author._id == user._id) ? 'row-reverse' : 'row';
		var align = (author._id == user._id) ? 'right' : 'left';
		var flex = (author._id == user._id) ? 'flex-end' : 'flex-start';
		var messageStyle = {
			//float: float
			flexDirection: direction,
			textAlign: align
		};
		var bodyStyle = {
			justifyContent: flex,
			alignItems: flex
		}

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
		var created = createDate.toLocaleString('en-US', dateOptions);

		return (
			<div className='message-item' style={ messageStyle }>
				<img className='message-author-img' title={ authorName } alt={ authorName } src={ authorImage } />
				<div className='message-body' style={ bodyStyle }>
					<span className='message-text'>{ message.$body }</span>
					{/*<span className='message-info'>{ authorName + ' • ' + created }</span>*/}
					<span className='message-info'>{ created }</span>
				</div>
			</div>
		);
	}
});

module.exports = MessageItem;
