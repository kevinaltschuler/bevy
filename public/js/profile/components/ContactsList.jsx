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

	propTypes: {
		contacts: React.PropTypes.array
	},

	render: function() {

		var contacts = [];
		var allContacts = this.props.contacts;
		for(var key in allContacts) {
			var contact = allContacts[key];
			var email = contact.email || '';
			var aliasid = contact.aliasid || '';
			contacts.push(
				<ContactsItem
					key={ key }
					email={ email }
					aliasid={ aliasid }
				/>
			);
		}

		return <div>
				 	{ contacts }
				 </div>
	}
});
module.exports = ContactsList;
