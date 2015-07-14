'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var Dispatcher = require('./../shared/dispatcher');

var constants = require('./../constants');
var APP = constants.APP;
var BEVY = constants.BEVY;

var BevyStore = require('./../bevy/BevyStore');

var Contacts = require('./ContactCollection');

var user = window.bootstrap.user;

var ContactStore = _.extend({}, Backbone.Events);

_.extend(ContactStore, {

	contacts: new Contacts,

	handleDispatch: function(payload) {
		switch(payload.actionType) {
			case APP.LOAD:

				Dispatcher.waitFor([BevyStore.dispatchToken]);

				var bevies = BevyStore.getMyBevies();
				bevies.forEach(function(bevy) {
					if(bevy.settings.anonymise_users) {
						// for now... skip anonymous users
						//return;
					}
					if(bevy._id == -1) return; // dont try to do anything with the frontpage
					bevy.members.forEach(function(member) {
						if(_.isObject(member.user)) {
							if(member.user._id == user._id) {
								return; // dont add self
							}
							// keep track of anonymous users
							if(bevy.settings.anonymise_users) {
								member.anonymous = true;
								return; // for now, dont add anonymous members
							} else {
								member.anonymous = false;
							}
							// add to collection
							// try to find an existing contact
							var existingContact = this.contacts.find(function(contact) {
								return member.user._id == contact.get('user')._id;
							});
							if(existingContact == undefined) {
								// not found, dont ask questions and add this
								this.contacts.add(member);
							} else {
								// prefer non anonymous users over anonymous ones
								if(existingContact.get('anonymous') && !member.anonymous) {
									this.contacts.remove(existingContact);
									this.contacts.add(member);
								}
							}
						}
					}.bind(this));
				}.bind(this));

				//console.log(this.contacts);

				break;
		}
	},

	getAll: function() {
		return this.contacts.toJSON();
	},

	getContact: function(user_id) {
		var contact = this.contacts.find(function($contact) {
			return $contact.get('user')._id == user_id;
		});
		return (contact) ? contact.toJSON() : {};
	}
});

Dispatcher.register(ContactStore.handleDispatch.bind(ContactStore));
module.exports = ContactStore;
