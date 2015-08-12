'use strict';

var React = require('react');

var $ = require('jquery');

var BevyPanel = require('./../../bevy/components/BevyPanel.jsx');
var FrontpagePanel = require('./../../bevy/components/FrontpagePanel.jsx');
var Footer = require('./Footer.jsx');

var RightSidebar = React.createClass({

	propTypes: {
		activeBevy: React.PropTypes.object,
		activeMember: React.PropTypes.object,
		activeThread: React.PropTypes.object
	},

	getInitialState: function () {
		return {};
	},

	render: function() {

		var bevy = this.props.activeBevy;
		var bevy_id = bevy._id;

		return (
			<div className='right-sidebar'>
				<div className='fixed'>
					<div className='hide-scroll'>
						<BevyPanel
							activeBevy={ this.props.activeBevy }
							myBevies={ this.props.myBevies }
						/>
						<Footer />
					</div>
				</div>
			</div>
		);
	}
});
module.exports = RightSidebar;
