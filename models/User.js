/**
 * User.js
 *
 * Mongoose models for bevy users
 *
 * @author albert
 */

'use strict';

var mongoose = require('mongoose');
var _ = require('underscore');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	token: String,
	password: String,
	email: {
		type: String,
		unique: true
	},
	image_url: String,
	google: {
		provider: String,
		id: String,
		name: {
			familyName: String,
			givenName: String,
			middleName:String
		},
		displayName: String,
		token: String,
		emails: [Schema({
			value: String,
			type: {
				type: String
			}
		}, {
			_id: false
		})],
		photos: [Schema({
			value: String
		}, {
			_id: false
		})]
	},
	notifications: [Schema({
		event: String,
	  	data: {}
	})],
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	}
});

UserSchema.virtual('displayName').get(function() {
	var name;
	var maxLength = 30; // max length, in characters, of someone's name
	if(_.isEmpty(this.google.emails)) {
		name = this.email;
	} else {
		if(_.isEmpty(this.google.name)) {
			name = this.email;
		} else {
			name = this.google.name.givenName + ' ' + this.google.name.familyName;
		}
	}
	if(name.length > 30) {
		name = name.slice(26);
		name += '...';
		return name;
	} else {
		return name;
	}
});

UserSchema.set('toObject', {
	getters: true,
	virtuals: true
});
UserSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

module.exports = UserSchema;
