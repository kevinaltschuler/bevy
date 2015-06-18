'use strict';

var Backbone = require('backbone');

var ContactModel = require('./ContactModel');

var ContactCollection = Backbone.Collection.extend({
	model: ContactModel

});

module.exports = ContactCollection;
