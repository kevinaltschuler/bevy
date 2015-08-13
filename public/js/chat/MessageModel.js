/**
 * MessageModel.js
 *
 * @author albert
 */

'use strict';

var Backbone = require('backbone');

var MessageModel = Backbone.Model.extend({
  defaults: {
    body: '',
    created: Date.now()
  },
  idAttribute: '_id'
});

module.exports = MessageModel;
