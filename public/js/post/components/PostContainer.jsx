'use strict';

var React = require('react');

var Post = require('./Post.jsx');

var PostStore = require('./../PostStore');

module.exports = React.createClass({
	render: function() {
		return	<div className="col-xs-6">
						<Post />
					</div>
	}
});
