/**
 * MemberList.jsx
 *
 * @author KEVIN
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var rbs = require('react-bootstrap');
var ButtonGroup = rbs.ButtonGroup;

var MemberItem = require('./MemberItem.jsx');

var user = window.bootstrap.user;
//console.log(user);

var MemberList = React.createClass({

	propTypes: {
		activeBevy: React.PropTypes.object,
		activeMember: React.PropTypes.object,
		contacts: React.PropTypes.array
	},

	render: function() {

		var contacts = [];
		var allContacts = this.props.contacts;
		for(var key in allContacts) {
			var contact = allContacts[key];
			var active = false;

			if(_.isObject(this.props.activeMember)) {
				if(!_.isEmpty(contact.user)) {
					if(_.isObject(contact.user)) {
						if(contact.user._id == this.props.activeMember._id) active = true;
					}
				}
			}

			contacts.push(
				<MemberItem
					key={ key }
					contact={ contact }
					active={ active }
					activeBevy={ this.props.activeBevy }
					activeMember={ this.props.activeMember }
				/>
			);
		}

		return <div>
				 	{ contacts }
				 </div>
	}
});
module.exports = MemberList;
