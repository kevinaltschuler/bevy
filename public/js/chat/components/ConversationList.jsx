'use strict';

var React = require('react');
var _ = require('underscore');

var rbs = require('react-bootstrap');
var Button = rbs.Button;

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

				var messageMember = this.findMember(bevy.members, latestMessage.author._id);

				var messageAuthor = latestMessage.author.displayName;
				if(messageMember != undefined) messageAuthor = messageMember.displayName;
				if(latestMessage.author._id == user._id) messageAuthor = 'Me';

				message = (
					<span className='latest-message'>
						{ messageAuthor + ': ' + latestMessage.body }
					</span>
				);
			}

			threads.push(
				<Button className='conversation-item' key={ 'thread' + bevy._id } id={ thread._id } onClick={ this.openThread } onFocus={ this.openThread }>
					<img className='bevy-img' src={ bevy.image_url } />
					<div className='conversation-details'>
						<span className='bevy-name'>{ bevy.name }</span>
						{ message }
					</div>
				</Button>
			);
		}

		return (
			<div className='conversation-list panel'>
				<div className='conversation-list-header'>
					<span>Conversations</span>
				</div>
				<div className='list-links'>
					{ threads }
				</div>
			</div>
		);
	}
});

module.exports = ConversationList;
