'use strict';

var React = require('react');

var ContactItem = require('./ContactItem.jsx');

var ContactList = React.createClass({
	render: function() {
		return (
			<div className='contact-list panel'>
				<span className='contact-list-header'>Contacts</span>
			</div>
		);
	}
});

module.exports = ContactList;
