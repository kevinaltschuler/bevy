'use strict';

var React = require('react');

var BevyList = require('./../../bevy/components/BevyList.jsx');

module.exports = React.createClass({

	propTypes: {
		allBevies: React.PropTypes.array.isRequired,
		activeAlias: React.PropTypes.object.isRequired,
		activeBevy: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {};
	},

	render: function() {
		return	<div className='col-sm-3 hidden-xs left-sidebar panel'>
						<BevyList
							allBevies={ this.props.allBevies }
							activeAlias={ this.props.activeAlias }
							activeBevy={ this.props.activeBevy }
						/>
					</div>;
	}
});
