'use strict';

var React = require('react');

var BevyPanel = require('./../../bevy/components/BevyPanel.jsx');
var Footer = require('./../../bevy/components/Footer.jsx');

var RightSidebar = React.createClass({

	propTypes: {
		activeBevy: React.PropTypes.object,
		activeMember: React.PropTypes.object
	},

	render: function() {
		return <div className= "col-sm-3 right-sidebar-col">
					<div className="row">
						<BevyPanel
							activeBevy={ this.props.activeBevy }
							activeMember={ this.props.activeMember }
						/>
					</div>
					<div className="row">
						<Footer />
					</div>
				 </div>
	}
});
module.exports = RightSidebar;
