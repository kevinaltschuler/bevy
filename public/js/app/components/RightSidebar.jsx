'use strict';

var React = require('react');

var BevyPanel = require('./../../bevy/components/BevyPanel.jsx');

var RightSidebar = React.createClass({

	propTypes: {
		activeBevy: React.PropTypes.object,
		activeAlias: React.PropTypes.object
	},

	render: function() {
		return <div>
					<BevyPanel
						activeBevy={ this.props.activeBevy }
						activeAlias={ this.props.activeAlias }
					/>
				 </div>
	}
});
module.exports = RightSidebar;
