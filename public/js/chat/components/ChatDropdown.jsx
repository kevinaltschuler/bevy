/**
 * ChatDropdown.jsx
 *
 * @author KEVIN
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var rbs = require('react-bootstrap');
var OverlayTrigger = rbs.OverlayTrigger;
var ModalTrigger = rbs.ModalTrigger;
var Button = rbs.Button;
var Popover = rbs.Popover;
var ButtonGroup = rbs.ButtonGroup;
var Tooltip = rbs.Tooltip;
var OverlayMixin = rbs.OverlayMixin;

var mui = require('material-ui');
var FlatButton = mui.FlatButton;
var IconButton = mui.IconButton;

var SubBevyPanel = require('./../../bevy/components/SubBevyPanel.jsx');
var ContactList = require('./../../contact/components/ContactList.jsx');
var ConversationList = require('./../../chat/components/ConversationList.jsx');
var PublicChatPanel = require('./../../chat/components/PublicChatPanel.jsx');

var user = window.bootstrap.user;
var email = user.email;

var ChatDropdown = React.createClass({

	propTypes: {
		allContacts: React.PropTypes.array,
		allThreads: React.PropTypes.array,
		activeThread: React.PropTypes.object
	},

	getInitialState: function() {
		return {
			isOverlayOpen: false,
		};
	},

  	handleToggle: function(ev) {
  		ev.preventDefault();
  		this.setState({
  			isOverlayOpen: !this.state.isOverlayOpen
  		});
  	},

  	renderOverlay: function() {
  		if(!this.state.isOverlayOpen) return <span />

  		return (
  			<div>
				<div className='chat-backdrop' onClick={ this.handleToggle } />
				<Popover className="chat-dropdown" placement='bottom'>
					<div className='top'>
						<div className='text'>
							chat
						</div>
						<div className='actions'>
							<span className='glyphicon glyphicon-plus'/>
						</div>
					</div>
					<ConversationList
						allThreads={ this.props.allThreads }
					/>
			</Popover>
			</div>
		);
  	},

	render: function() {

		return (
			<div>
				<Button className="chat-dropdown-btn" onClick={ this.handleToggle }>
					<div className='chat-img'/>
				</Button>
				{ this.renderOverlay() }
			</div>
		);
	}
});
module.exports = ChatDropdown;
