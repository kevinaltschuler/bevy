/*
 * Device.js
 * @author albert
 * @flow
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var DeviceSchema = new Schema({
  deviceID: {
    type: String
  },
  platform: {
    type: String,
    enum: ['ios', 'android']
  },
  token: {
    type: String
  },
  manufacturer: {
    type: String
  },
  model: {
    type: String
  },
  uniqueID: {
    type: String
  },
  name: {
    type: String
  },
  version: {
    type: String
  },
  bundleID: {
    type: String
  },
  buildNum: {
    type: String
  },
  appVersion: {
    type: String
  },
  appVersionReadable: {
    type: String
  },
  lastAccessed: {
    type: Date
  }
});

module.exports = DeviceSchema;