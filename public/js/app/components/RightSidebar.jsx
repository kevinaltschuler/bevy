'use strict';

var React = require('react');

var BevyPanel = require('./../../bevy/components/BevyPanel.jsx');
var Footer = require('./Footer.jsx');

var RightSidebar = React.createClass({

	propTypes: {
		activeBevy: React.PropTypes.object,
		activeMember: React.PropTypes.object
	},

	render: function() {

		var bevy = this.props.activeBevy;
		var bevy_id = bevy.get('_id');

		var panel = (bevy_id == -1)
		? ''
		: (<BevyPanel
				activeBevy={ this.props.activeBevy }
				activeMember={ this.props.activeMember }
			/>);

		return <div className= "col-sm-3 right-sidebar-col">
					<div className="row">
						{ panel }
					</div>
					<div className="row">
						<Footer />
					</div>
				 </div>
	}
});
module.exports = RightSidebar;
