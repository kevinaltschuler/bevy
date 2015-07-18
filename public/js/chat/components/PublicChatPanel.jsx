'use strict';

var React = require('react');
var _ = require('underscore');

var rbs = require('react-bootstrap');
var Button = rbs.Button;
var Input = rbs.Input;

var mui = require('material-ui');
var FloatingActionButton = mui.FloatingActionButton;

var MessageList = require('./MessageList.jsx');

var ChatActions = require('./../ChatActions');
var ChatStore = require('./../ChatStore');
var BevyStore = require('./../../bevy/BevyStore');

var constants = require('./../../constants');
var CHAT = constants.CHAT;

var user = window.bootstrap.user;

var PublicChatPanel = React.createClass({

	propTypes: {
		activeBevy: React.PropTypes.object,
		activeThread: React.PropTypes.object,
		disabled: React.PropTypes.bool
	},

	getInitialState: function() {
		return {
			body: '',
			messages: []
		};
	},

	componentWillReceiveProps: function(nextProps) {
		console.log(nextProps.activeThread._id);
		ChatStore.off(CHAT.MESSAGE_FETCH + this.props.activeThread._id, this._onMessageFetch);
		ChatStore.on(CHAT.MESSAGE_FETCH + nextProps.activeThread._id, this._onMessageFetch);
	},

	/*componentDidMount: function() {
		console.log(this.props.activeThread._id);
		ChatStore.on(CHAT.MESSAGE_FETCH + this.props.activeThread._id, this._onMessageFetch);
	},

	componentWillUnmount: function() {

	},*/

	_onMessageFetch: function() {
		console.log('got to here');
		this.setState({
			messages: ChatStore.getMessages(this.props.activeThread)
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
			var thread = this.props.activeThread;
			var author = window.bootstrap.user;
			var body = this.refs.body.getValue();
			console.log(thread._id);
			ChatActions.createMessage(thread._id, author, body);

			// reset input field
			this.setState({
				body: ''
			});
		}
	},

	openPanel: function(ev) {
		ev.preventDefault();
		document.getElementById("public-chat-panel").style.height = "400px";
		document.getElementById("public-chat-btn").style.display = "none";
		document.getElementById("btn-background").style.display = "none";
	},

	closePanel: function(ev) {
		ev.preventDefault();
		document.getElementById("public-chat-panel").style.height = "0px";
		document.getElementById("public-chat-btn").style.display = "inherit";
		document.getElementById("btn-background").style.display = "inherit";
	},

	render: function() {

		var bevy = this.props.activeBevy;
		var thread = this.props.activeThread;
		var name = (bevy == undefined) ? '' : bevy.name;

		var backgroundStyle = (bevy && !_.isEmpty(bevy.image_url))
		? {
			backgroundImage: 'url(' + bevy.image_url + ')'
		}
		: {};

		var floatingBtnStyle = (bevy && !_.isEmpty(bevy.image_url))
		? {
			textShadow: '1px 3px 3px rgba(0,0,0,.4)',
			backgroundColor: 'rgba(0,0,0,0)'
		}
		: {};

		var btnWrapperStyle = (bevy && !_.isEmpty(bevy.image_url))
		? {
  			height: '56px',
  			width: '56px',
  			borderRadius: '50%',
  			padding: '0',
  			overflow: 'hidden',
			position: 'fixed',
			right: '40px',
			bottom: '30px'
		}
		: {};

		var btnBgStyle = (bevy && !_.isEmpty(bevy.image_url))
		? {
  			height: '150%',
  			width: '150%',
  			'-webkit-filter': 'blur(3px)',
  			backgroundImage: 'url(' + bevy.image_url + ')',
			backgroundPosition: 'center',
			backgroundSize: '100% auto',
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

		var body = (_.isEmpty(this.props.activeThread))
		? (<div/>)
		: (	<div className='chat-panel-body'>
				<MessageList
					thread={ thread }
					messages={ this.state.messages }
					bevy={ bevy }
				/>
				{ input }
			</div>
		);

		if(this.props.activeThread == undefined) {
			return <div/>
		}
		else {
			return (
				<div>
					<div id='public-chat-panel' className='chat-panel public-chat-panel'>
						{ header }
						{ body }
					</div>
					<div id='btn-background' className='btn-background' style={btnWrapperStyle}>
						<div style={btnBgStyle}/>
					</div>
					<FloatingActionButton 
						id='public-chat-btn' 
						style={floatingBtnStyle} 
						onClick={this.openPanel} 
						className='floating-chat-btn' 
						iconClassName="glyphicon glyphicon-comment"
					/>
				</div>
			);
		}
	}
});

module.exports = PublicChatPanel;
