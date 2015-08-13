/**
 * MessageCollection.js
 *
 * @author albert
 */

'use strict';

var Backbone = require('backbone');
var Message = require('./MessageModel');

var MessageCollection = Backbone.Collection.extend({
  model: Message,
  comparator: 'created'
});

module.exports = MessageCollection;
