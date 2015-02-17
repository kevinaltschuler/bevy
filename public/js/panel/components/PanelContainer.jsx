'use strict';

var React = require('react');

var Panel = require('./Panel.jsx');

module.exports = React.createClass({
	render: function() {
		return	<div className="col-xs-6">
						<Panel />
					</div>
	}
});
