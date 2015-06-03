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
	if(_.isEmpty(this.google)) {
		return this.email;
	} else {
		if(_.isEmpty(this.google.name)) {
			return this.email;
		} else {
			return this.google.name.givenName + ' ' + this.google.name.familyName;
		}
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
