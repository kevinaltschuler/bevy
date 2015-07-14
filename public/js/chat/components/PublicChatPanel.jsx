'use strict';

var React = require('react');
var _ = require('underscore');

var rbs = require('react-bootstrap');
var Button = rbs.Button;
var Input = rbs.Input;

var MessageList = require('./MessageList.jsx');

var ChatActions = require('./../ChatActions');
var ChatStore = require('./../ChatStore');
var BevyStore = require('./../../bevy/BevyStore');

var constants = require('./../../constants');
var CHAT = constants.CHAT;

var user = window.bootstrap.user;

var PublicChatPanel = React.createClass({

	propTypes: {
		activeBevy: React.PropTypes.object
	},

	getInitialState: function() {
		return {
			body: '',
		};
	},

	componentDidMount: function() {
	},

	componentWillUnmount: function() {
	},

	_onMessageFetch: function() {
		this.setState({
			messages: ChatStore.getMessages(this.props.thread._id)
		});
	},

	onChange: function(ev) {
		var body = this.refs.body.getValue();
		this.setState({
			body: body
		});
	},

	onKeyPress: function(ev) {
		if(ev.which == 13) {

			// dont send empty messages
			if(_.isEmpty(this.state.body)) return;

			// create message
			var thread = this.props.thread;
			var author = window.bootstrap.user;
			var body = this.refs.body.getValue();
			//ChatActions.createMessage(thread._id, author, body);

			// reset input field
			this.setState({
				body: ''
			});
		}
	},

	render: function() {

		var bevy = this.props.activeBevy;
		var thread = this.props.thread;
		var name = bevy.name;

		var backgroundStyle = (bevy && !_.isEmpty(bevy.image_url))
		? {
			backgroundImage: 'url(' + bevy.image_url + ')'
		}
		: {};

		var otherUser = {};
		/*if(!bevy && thread.members.length > 1) {
			otherUser = _.find(thread.members, function(member) {
				return member.user._id != user._id;
			});
		}*/

		var header = (
			<div className='chat-panel-header'>
				<div className='chat-panel-background-wrapper'>
					<div className='chat-panel-background-image' style={ backgroundStyle } />
				</div>
				<div className='chat-panel-head'>
					<div className='bevy-name' title={ name }>
						{ name }
					</div>
				</div>
			</div>
		);

		var input = (
			<div className='chat-panel-input'>
				<div className='chat-text-field'>
					<Input
						type='text'
						ref='body'
						placeholder='Chat'
						onKeyPress={ this.onKeyPress }
						onChange={ this.onChange }
						value={ this.state.body }
					/>
				</div>
			</div>
		);
		if(!this.state.isOpen) input = <div />;

		var body = (
			<div className='chat-panel-body'>
				{/*<MessageList
					thread={ thread }
					messages={ this.state.messages }
					bevy={ bevy }
				/>*/}
				{ input }
			</div>
		);

		return (
			<div className='chat-panel public-chat-panel'>
				{ header }
				{ body }
			</div>
		);
	}
});

module.exports = PublicChatPanel;
