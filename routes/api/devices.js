/**
 * routes/api/devices.js
 *
 * @author albert
 * @flow
 */

'use strict';

var deviceController = require('./../../controllers/devices');
var oauth2Controller = require('./../../controllers/oauth2');
var permissionsController = require('./../../controllers/permissions');

module.exports = function(router) {
  // DEVICES
  router.get('/users/:id/devices', deviceController.getDevices);
  router.post('/users/:id/devices', deviceController.addDevice);
  router.put('/users/:id/devices/:deviceid', deviceController.updateDevice);
  router.patch('/users/:id/devices/:deviceid', deviceController.updateDevice);
  router.delete('/users/:id/device/:deviceid', deviceController.removeDevice);
};
