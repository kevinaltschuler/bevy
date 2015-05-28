'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roles = 'admin mod user'.split(' ');

var fruits = 'Apple Banana Cherry Chili Corn Drumstick Egg Grape Mushroom Onion Orange Peach Pear Pineapple Plum Pumpkin Turnip Watermelon'.split(' ');
var fruit = null;

var BevyMemberSchema = new Schema({
	email: {
		type: String
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	displayName: {
		type: String,
		default: function() {
			fruit = (fruit) ? fruit : fruits[Math.floor(Math.random() * fruits.length)];
			return 'Anonymous ' + fruit;
		}
	},
	image_url: {
		type: String,
		default: function() {
			fruit = (fruit) ? fruit : fruits[Math.floor(Math.random() * fruits.length)];
			return '/img/anonymous-icons/' + fruit.toLowerCase() + '.png';
		}
	},
	notificationLevel: {
		type: String,
		default: 'all'
	},
	role: {
		type: String,
		enum: roles,
		default: 'user'
	}
}, { _id: false });

BevyMemberSchema.set('toObject', {
	getters: true,
	virtuals: true
});
BevyMemberSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

module.exports = BevyMemberSchema
