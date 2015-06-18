'use strict';

var React = require('react');
var $ = require('jquery');

var rbs = require('react-bootstrap');
var TabbedArea = rbs.TabbedArea;
var TabPane = rbs.TabPane;

var BevyList = require('./../../bevy/components/BevyList.jsx');
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
			key: 1
		};
	},

	onTab: function(key) {
		this.setState({
			key: key
		});
	},

	render: function() {
		return (
			<div className='left-sidebar'>
				<div className='fixed'>
					<div className='hide-scroll'>
						<BevyList
							allBevies={ this.props.allBevies }
							activeBevy={ this.props.activeBevy }
						/>
						<TabbedArea className='chat-tabs' activeKey={ this.state.key } onSelect={ this.onTab } animation={ false }>
							<TabPane eventKey={ 1 } tab='Conversations'>
								<ConversationList
									allThreads={ this.props.allThreads }
								/>
							</TabPane>
							<TabPane eventKey={ 2 } tab='Contacts'>
								<ContactList
									allContacts={ this.props.allContacts }
								/>
							</TabPane>
						</TabbedArea>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = LeftSidebar;
