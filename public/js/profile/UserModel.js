/**
 * UserModel.js
 * @author albert
 */

'use strict';

var Backbone = require('backbone');

var UserModel = Backbone.Model.extend({
  idAttribute: '_id',

  initialize() {
    
  }
});

module.exports = UserModel;