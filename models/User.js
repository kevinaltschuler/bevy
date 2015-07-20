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
var shortid = require('shortid');

var UserSchema = new Schema({
	_id: {
		type: String,
		unique: true,
		default: shortid.generate()
	},
	token: String,
	password: String,
	email: {
		type: String,
		unique: true
	},
	image_url: String,
	points: String,
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
	bevies: [{
		type: String,
		ref: 'Bevy'
	}],
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
	var name = 'nameless';
	if(_.isEmpty(this.google.emails)) {
		name = this.email;
	} else {
		if(_.isEmpty(this.google.name)) {
			name = this.email;
		} else {
			name = this.google.name.givenName + ' ' + this.google.name.familyName;
		}
	}
	return name;
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
