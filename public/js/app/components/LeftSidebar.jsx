'use strict';

var React = require('react');
var ReactPropTypes = React.PropTypes;

var BevyList = require('./../../bevy/components/BevyList.jsx');

module.exports = React.createClass({

	propTypes: {
		  allBevies: ReactPropTypes.array.isRequired
		, activeBevy: ReactPropTypes.object.isRequired
	},

	getInitialState: function() {
		return {};
	},

	render: function() {
		return	<div className='col-sm-3 hidden-xs left-sidebar panel'>
						<BevyList allBevies={ this.props.allBevies } activeBevy={ this.props.activeBevy }/>
					</div>;
	}
});
