'use strict';

var React = require('react');

var BevyPanel = require('./../../bevy/components/BevyPanel.jsx');

var RightSidebar = React.createClass({

	propTypes: {
		activeBevy: React.PropTypes.object
	},

	render: function() {
		return <div>
					<BevyPanel
						activeBevy={ this.props.activeBevy }
					/>
				 </div>
	}
});
module.exports = RightSidebar;
