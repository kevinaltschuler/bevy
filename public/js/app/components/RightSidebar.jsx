'use strict';

var React = require('react');

var $ = require('jquery');

var BevyPanel = require('./../../bevy/components/BevyPanel.jsx');
var FrontpagePanel = require('./../../bevy/components/FrontpagePanel.jsx');
var Footer = require('./Footer.jsx');

var RightSidebar = React.createClass({

	propTypes: {
		activeBevy: React.PropTypes.object,
		activeMember: React.PropTypes.object
	},

	getInitialState: function () {
		return {};
	},

	render: function() {

		var bevy = this.props.activeBevy;
		var bevy_id = bevy._id;

		var panel = (bevy_id == -1)
		? (<FrontpagePanel />)
		: (<BevyPanel
				activeBevy={ this.props.activeBevy }
				activeMember={ this.props.activeMember }
			/>);

		return (
			<div className='right-sidebar'>
				<div className='fixed'>
					<div className='hide-scroll'>
						{ panel }
						<Footer />
					</div>
				</div>
			</div>
		);
	}
});
module.exports = RightSidebar;
