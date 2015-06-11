'use strict';

var React = require('react');

var MessageItem = require('./MessageItem.jsx');

var MessageList = React.createClass({

	propTypes: {
		messages: React.PropTypes.array
	},

	render: function() {

		var allMessages = this.props.messages;
		var messages = [];
		for(var key in allMessages) {
			var message = allMessages[key];
			messages.push(
				<MessageItem
					key={ message._id }
					message={ message }
				/>
			);
		}

		return (
			<div className='message-list'>
				{ messages }
			</div>
		);
	}
});

module.exports = MessageList;
