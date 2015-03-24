/**
 * ContactsList.jsx
 *
 * @author KEVIN
 */

'use strict';

var React = require('react');

var rbs = require('react-bootstrap');
var ButtonGroup = rbs.ButtonGroup;

var ContactsItem = require('./ContactsItem.jsx');

var user = window.bootstrap.user;
//console.log(user);

var ContactsList = React.createClass({

	render: function() {

		return <div>
				 	<ContactsItem />
				 </div>
	}
});
module.exports = ContactsList;
