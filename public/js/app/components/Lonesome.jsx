'use strict';

var React = require('react');

var Lonesome = React.createClass({
	render: function() {
		return (
			<div className='lonesome panel'>
				<h1>Hey Buddy,</h1>
				<p>It looks like you&#39;re not part of anyone&#39;s bevy yet.</p>
				<p>Use the sidebar to the left to create one yourself, or check your notifications to see if your friends sent you an invite already.</p>
			</div>
		);
	}
});

module.exports = Lonesome;
