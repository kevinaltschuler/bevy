'use strict';

var React = require('react');
var $ = require('jquery');

var rbs = require('react-bootstrap');
var OverlayTrigger = rbs.OverlayTrigger;
var Tooltip = rbs.Tooltip;

var SubBevyPanel = require('./../../bevy/components/SubBevyPanel.jsx');
var ContactList = require('./../../contact/components/ContactList.jsx');
var ConversationList = require('./../../chat/components/ConversationList.jsx');

var LeftSidebar = React.createClass({

	propTypes: {
		allBevies: React.PropTypes.array.isRequired,
		activeBevy: React.PropTypes.object.isRequired,
		allThreads: React.PropTypes.array.isRequired,
		allContacts: React.PropTypes.array.isRequired
	},

	getInitialState: function() {
		return {
			key: '1'
		};
	},

	onTab: function(ev) {
		ev.preventDefault();

		var key = ev.target.getAttribute('id');

		this.setState({
			key: key
		});
	},

	render: function() {

		var tabContent = '';
		switch(this.state.key) {
			case '1':
			case 1:
				tabContent = (
					<ConversationList
						allThreads={ this.props.allThreads }
					/>
				);
				break;
			case '2':
			case 2:
				tabContent = (
					<ContactList
						allContacts={ this.props.allContacts }
					/>
				);
				break;
		}

		return (
			<div className='left-sidebar'>
				<div className='fixed'>
					<div className='hide-scroll'>
						<SubBevyPanel
							allBevies={ this.props.allBevies }
							activeBevy={ this.props.activeBevy }
						/>

						<nav className='chat-tabs'>
							<ul className='chat-tabs nav nav-tabs'>
								<li className={ (this.state.key == 1) ? 'active' : '' }>
									<OverlayTrigger placement='top' overlay={ <Tooltip>Conversations</Tooltip> }>
										<a role='button' href='#' id='1' onClick={ this.onTab }>
											<div className='tab-title' id='1'>
												<span className='glyphicon glyphicon-comment' id='1'></span>
											</div>
										</a>
									</OverlayTrigger>
								</li>
								<li className={ (this.state.key == 2) ? 'active' : '' }>
									<OverlayTrigger placement='top' overlay={ <Tooltip>Contacts</Tooltip> }>
										<a role='button' href='#' id='2' onClick={ this.onTab }>
											<div className='tab-title' id='2'>
												<span className='glyphicon glyphicon-user' id='2'></span>
											</div>
										</a>
									</OverlayTrigger>
								</li>
							</ul>
						</nav>
						<div className='tab-content'>
							{ tabContent }
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = LeftSidebar;
