'use strict';

var RouterStore = require('./../RouterStore');
var React = require('react');

var events = 'add remove change reset';

module.exports = React.createClass({

	getInitialState: function() {
		return {RouterStore: RouterStore}
	},

	componentDidMount: function() {
		RouterStore.on(events, function() {
			this.forceUpdate();
		}, this);
	},

	componentWillUnmount: function() {
		RouterStore.off(null, null, this);
	},


	render: function() {
		var props = {
			  route: this.state.RouterStore.get('route')
			, routeParams: this.state.RouterStore.get('params')
		};

		// render empty div
		return <div {...props} />
	}
});
