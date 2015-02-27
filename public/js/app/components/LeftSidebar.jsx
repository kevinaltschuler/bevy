'use strict';

var React = require('react');
var ReactPropTypes = React.PropTypes;

var BevyList = require('./../../bevy/components/BevyList.jsx');

module.exports = React.createClass({

	propTypes: {
		allBevies: ReactPropTypes.array.isRequired
	},

	getInitialState: function() {
		return {};
	},

	render: function() {
		return	<BevyList allBevies={ this.props.allBevies }/>;
	}
});
