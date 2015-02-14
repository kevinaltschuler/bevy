var Backbone = require('backbone');
var Dispatcher = require('./../dispatcher');

var baseStore = {
	// backbone init method
	initialize: function() {
		this.dispatchId = Dispatcher.register(this.handleDispatch.bind(this));
	},
	// handle the dispatcher actions
	handleDispatch: function(payload) { }
};

module.exports = {
	  Model: Backbone.Model.extend(baseStore)
	, Collection: Backbone.Collection.extend(baseStore)
};
