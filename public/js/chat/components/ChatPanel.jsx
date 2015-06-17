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

var ChatPanel = React.createClass({

	propTypes: {
		thread: React.PropTypes.object
	},

	getInitialState: function() {
		return {
			isOpen: true,
			body: '',
			messages: ChatStore.getMessages(this.props.thread._id)
		};
	},

	componentDidMount: function() {
		ChatStore.on(CHAT.MESSAGE_FETCH + this.props.thread._id, this._onMessageFetch);
	},

	componentWillUnmount: function() {
		ChatStore.off(CHAT.MESSAGE_FETCH + this.props.thread._id, this._onMessageFetch);
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
			ChatActions.createMessage(thread._id, author, body);

			// reset input field
			this.setState({
				body: ''
			});
		}
	},

	handleToggle: function(ev) {
		ev.preventDefault();
		this.setState({
			isOpen: !this.state.isOpen
		});
	},

	closePanel: function(ev) {
		ev.preventDefault();
		ChatActions.closePanel(this.props.thread._id);
	},

	render: function() {

		var thread = this.props.thread;
		var bevy = thread.bevy;

		var expandGlyph = (this.state.isOpen) ? 'glyphicon-minus' : 'glyphicon-plus';
		var expandTitle = (this.state.isOpen) ? 'Minimize' : 'Maximize';

		var backgroundStyle = (_.isEmpty(bevy.image_url))
		? {}
		: {
			backgroundImage: 'url(' + bevy.image_url + ')'
		};

		var header = (
			<div className='chat-panel-header'>
				<div className='chat-panel-background-wrapper'>
					<div className='chat-panel-background-image' style={ backgroundStyle } />
				</div>
				<div className='chat-panel-head'>
					<a href='#' className='bevy-name' title={ expandTitle } onClick={ this.handleToggle }>
						{ bevy.name }
					</a>
					<span className={ 'glyphicon ' + expandGlyph + ' btn' } title={ expandTitle } onClick={ this.handleToggle }></span>
					<span className="glyphicon glyphicon-remove btn" title='Close' onClick={ this.closePanel }></span>
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
				<MessageList
					thread={ thread }
					messages={ this.state.messages }
					bevy={ bevy }
				/>
				{ input }
			</div>
		);
		if(!this.state.isOpen) body = <div />;

		return (
			<div className='chat-panel'>
				{ header }
				{ body }
			</div>
		);
	}
});

module.exports = ChatPanel;
