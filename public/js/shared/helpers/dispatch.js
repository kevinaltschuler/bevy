var Dispatcher = require('./../dispatcher');

// a bit more standardized way to dispatch actions
module.exports = function(actionType, payload) {
	payload = payload || {};
	payload.actionType = actionType;
	return Dispatcher.dispatch(payload);
}
