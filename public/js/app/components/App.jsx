'use strict';

var React = require('react');
var RouterLink = require('./../../router/components/RouterLink.jsx');

module.exports = React.createClass({
	render: function(){
		return <div>
		the app
		<RouterLink href="test">test</RouterLink>
		</div>;

	}
});
