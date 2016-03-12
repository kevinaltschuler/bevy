/**
 * routes/api/events.js
 *
 * API routes for events
 *
 * @author albert
 * @flow
 */

'use strict';

var eventsController = require('./../../controllers/events');

module.exports = function(router) {
  router.get('/bevies/:bevyid/events', eventsController.getBevyEvents);
  router.post('/events', eventsController.createEvent);
  router.post('/bevies/:bevyid/events', eventsController.createEvent);
  router.get('/events/:eventid', eventsController.getEvent);
  router.put('/events/:eventid', eventsController.updateEvent);
  router.patch('/events/:eventid', eventsController.updateEvent);
  router.delete('/events/:eventid', eventsController.destroyEvent);
};
