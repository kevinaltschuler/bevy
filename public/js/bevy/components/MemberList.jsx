/**
 * MemberList.jsx
 *
 * @author KEVIN
 */

'use strict';

var React = require('react');

var rbs = require('react-bootstrap');
var ButtonGroup = rbs.ButtonGroup;

var MemberItem = require('./MemberItem.jsx');

var user = window.bootstrap.user;
//console.log(user);

var MemberList = React.createClass({

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
				<MemberItem
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
module.exports = MemberList;
