'use strict';

var React = require('react');
var $ = require('jquery');

var rbs = require('react-bootstrap');
var OverlayTrigger = rbs.OverlayTrigger;
var Tooltip = rbs.Tooltip;

var SubBevyPanel = require('./../../bevy/components/SubBevyPanel.jsx');
var ConversationList = require('./../../chat/components/ConversationList.jsx');

var LeftSidebar = React.createClass({

	propTypes: {
		myBevies: React.PropTypes.array.isRequired,
		activeBevy: React.PropTypes.object.isRequired,
		allThreads: React.PropTypes.array.isRequired,
		activeThread: React.PropTypes.object,
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
		return (
			<div className='left-sidebar'>
				<div className='fixed'>
					<div className='hide-scroll'>
						<SubBevyPanel
							myBevies={ this.props.myBevies }
							activeBevy={ this.props.activeBevy }
						/>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = LeftSidebar;
