'use strict';

var React = require('react');
var _ = require('underscore');
var $ = require('jquery');

var MessageItem = require('./MessageItem.jsx');

var ChatActions = require('./../ChatActions');
var ChatStore = require('./../ChatStore');

var constants = require('./../../constants');
var CHAT = constants.CHAT;

var MessageList = React.createClass({

	propTypes: {
		thread: React.PropTypes.object,
		messages: React.PropTypes.array,
		bevy: React.PropTypes.object
	},

	getInitialState: function() {
		return {
			loading: false
		};
	},

	componentDidMount: function() {
		ChatStore.on(CHAT.MESSAGE_FETCH + this.props.thread._id, this._onMessageFetch);
		var node = this.getDOMNode();
		node.scrollTop = node.scrollHeight;
	},

	componentWillUpdate: function() {
		var node = this.getDOMNode();
		this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
	},

	componentDidUpdate: function() {
		var node = this.getDOMNode();

		if(this.prevScrollHeight < node.scrollHeight) {
			node.scrollTop = node.scrollHeight - this.prevScrollHeight;
		}

		if(this.shouldScrollBottom) {
			node.scrollTop = node.scrollHeight;
		}
	},

	componentWillUnmount: function() {
		ChatStore.off(CHAT.MESSAGE_FETCH + this.props.thread._id, this._onMessageFetch);
	},

	_onMessageFetch: function() {

		this.setState({
			loading: false
		});
	},

	onScroll: function(ev) {
		var node = this.getDOMNode();
		if(node.scrollTop <= 0) {
			// load more
			this.setState({
				loading: true
			});
			this.prevScrollHeight = node.scrollHeight;

			ChatActions.loadMore(this.props.thread._id);
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

		var loading = (this.state.loading)
			? <span>Loading...</span>
			: '';

		return (
			<div id='message-list' className='message-list' onScroll={ this.onScroll }>
				{ loading }
				{ messages }
			</div>
		);
	}
});

module.exports = MessageList;
