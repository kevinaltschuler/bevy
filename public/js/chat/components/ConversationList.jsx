'use strict';

var React = require('react');
var _ = require('underscore');

var rbs = require('react-bootstrap');
var Button = rbs.Button;

var mui = require('material-ui');
var TextField = mui.TextField;

var ChatActions = require('./../ChatActions');
var ChatStore = require('./../ChatStore');

var user = window.bootstrap.user;

var ConversationList = React.createClass({

	propTypes: {
		allThreads: React.PropTypes.array
	},

	openThread: function(ev) {
		ev.preventDefault();

		var thread_id = ev.target.getAttribute('id');

		ChatActions.openThread(thread_id);
	},

	findMember: function(members, id) {
		return _.find(members, function(member) {
			return member.user == id;
		});
	},

	render: function() {

		var threads = [];
		var allThreads = (_.isEmpty(this.props.allThreads)) ? [] : this.props.allThreads;
		for(var key in allThreads) {
			var thread = allThreads[key];
			var bevy = thread.bevy;

			var latestMessage = ChatStore.getLatestMessage(thread._id);
			var message = '';
			if(!_.isEmpty(latestMessage)) {

				if(bevy) {
					var messageMember = this.findMember(bevy.members, latestMessage.author._id);

					var messageAuthor = latestMessage.author.displayName;
					if(messageMember != undefined) messageAuthor = messageMember.displayName;
					if(latestMessage.author._id == user._id) messageAuthor = 'Me';

					message = (
						<span className='latest-message'>
							{ messageAuthor + ': ' + latestMessage.body }
						</span>
					);
				} else {

					var messageAuthor = latestMessage.author.displayName;
					if(latestMessage.authr._id == user._id) messageAuthor = 'Me';

					message = (
						<span className='latest-message'>
							{ latestMessage.author.displayName + ': ' + latestMessage.body }
						</span>
					);
				}
			}

			var otherUser = {};
			if(!bevy && thread.users.length > 1) {
				otherUser = _.find(thread.users, function($user) {
					return $user._id != user._id;
				});
			}

			var image_url = (bevy) ? bevy.image_url : otherUser.image_url;
			var name = (bevy) ? bevy.name : otherUser.displayName;

			threads.push(
				<Button className='conversation-item' key={ 'thread' + thread._id } id={ thread._id } onClick={ this.openThread } onFocus={ this.openThread }>
					<img className='bevy-img' src={ image_url } />
					<div className='conversation-details'>
						<span className='bevy-name'>{ name }</span>
						{ message }
					</div>
				</Button>
			);
		}

		if(threads.length == 0) threads = 'No conversations active';

		return (
			<div className='conversation-list panel'>
				<div className='conversation-list-header'>
					{/*<TextField
						className='conversation-search'
						hintText='Search Conversations'
					/>*/}
				</div>
				<div className='list-links'>
					{ threads }
				</div>
			</div>
		);
	}
});

module.exports = ConversationList;
