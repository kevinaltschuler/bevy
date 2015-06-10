/**
 * Footer.jsx
 *
 * @author albert
 * @author kevin
 */

'use strict';

var React = require('react');

var Footer = React.createClass({
	render: function() {
		return (
			<span className="footer">
				English (US) · Bevy © 2015
				<br />
				Version 0.1 ALPHA
			</span>
		);
	}
});
module.exports = Footer;
