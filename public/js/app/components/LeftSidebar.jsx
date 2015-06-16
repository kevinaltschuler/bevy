'use strict';

var React = require('react');

var $ = require('jquery');

var BevyList = require('./../../bevy/components/BevyList.jsx');
var ContactList = require('./../../contact/components/ContactList.jsx');
var ConversationList = require('./../../chat/components/ConversationList.jsx');

var LeftSidebar = React.createClass({

	propTypes: {
		allBevies: React.PropTypes.array.isRequired,
		activeBevy: React.PropTypes.object.isRequired,
		allThreads: React.PropTypes.array.isRequired
	},

	getInitialState: function() {
		return {};
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
						<ConversationList
							allThreads={ this.props.allThreads }
						/>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = LeftSidebar;
