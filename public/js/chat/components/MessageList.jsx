'use strict';

var React = require('react');
var _ = require('underscore');
var $ = require('jquery');

var MessageItem = require('./MessageItem.jsx');

var MessageList = React.createClass({

	propTypes: {
		messages: React.PropTypes.array,
		bevy: React.PropTypes.object
	},

	getInitialState: function() {
		return {};
	},

	componentDidMount: function() {
		var node = this.getDOMNode();
		node.scrollTop = node.scrollHeight;
	},

	componentWillUpdate: function() {
		var node = this.getDOMNode();
		this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
	},

	componentDidUpdate: function() {
		if(this.shouldScrollBottom) {
			var node = this.getDOMNode();
			node.scrollTop = node.scrollHeight;
		}
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
					bevy={ this.props.bevy }
				/>
			);
		}

		return (
			<div id='message-list' className='message-list'>
				{ messages }
			</div>
		);
	}
});

module.exports = MessageList;
