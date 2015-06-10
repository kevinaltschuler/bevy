'use strict';

var React = require('react');

var $ = require('jquery');

var BevyList = require('./../../bevy/components/BevyList.jsx');

module.exports = React.createClass({

	propTypes: {
		allBevies: React.PropTypes.array.isRequired,
		activeBevy: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {};
	},

	render: function() {

		return	<div className='col-xs-3 left-sidebar'>
				 	<div className='panel left-sidebar-wrapper fixed' id='left-sidebar-wrapper'>
						<BevyList
							allBevies={ this.props.allBevies }
							activeBevy={ this.props.activeBevy }
						/>
					</div>
				</div>;
	}
});
