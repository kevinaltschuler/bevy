'use strict';

var React = require('react');

var Post = require('./Post.jsx');

module.exports = React.createClass({
	render: function() {
		return	<div className="col-xs-6">
						<Post />
					</div>
	}
});
