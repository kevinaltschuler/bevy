'use strict';

var React = require('react');
var _ = require('underscore');

var rbs = require('react-bootstrap');
var Button = rbs.Button;

var mui = require('material-ui');
var TextField = mui.TextField;

var ChatActions = require('./../../chat/ChatActions');

var ContactStore = require('./../ContactStore');

var ContactList = React.createClass({

	propTypes: {
		allContacts: React.PropTypes.array.isRequired
	},

	openThread: function(ev) {
		ev.preventDefault();

		var user_id = ev.target.getAttribute('id');

		ChatActions.openThread(null, user_id);
	},

	render: function() {

		var allContacts = this.props.allContacts;
		var contacts = [];
		allContacts.forEach(function(contact) {

			var $contact = ContactStore.getContact(contact.user._id);

			var image_url = ($contact.anonymous) ? $contact.image_url : $contact.user.image_url;
			var displayName = ($contact.anonymous) ? $contact.displayName : $contact.user.displayName;

			var contactImageStyle = {
				backgroundImage: 'url(' + image_url + ')'
			}

			contacts.push(
				<Button className='contact-item' key={ 'contact:' + contact.user._id } id={ contact.user._id } onFocus={ this.openThread }>
					<div className='contact-img' style={ contactImageStyle }></div>
					<div className='contact-name'>
						<span>{ displayName }</span>
					</div>
				</Button>
			);

			if(contacts.length <= 0) contacts = 'No Contacts Yet';

		}.bind(this));

		return (
			<div className='contact-list panel'>
				<div className='contact-list-header'>
					{/*<TextField
						className='contact-search'
						hintText='Search Contacts'
					/>*/}
				</div>
				<div className='list-links'>
					{ contacts }
				</div>
			</div>
		);
	}
});

module.exports = ContactList;
