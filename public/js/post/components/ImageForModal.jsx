/**
 * ImageForModal.jsx
 *
 * @author kevin
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var rbs = require('react-bootstrap');

var ImageForModal = React.createClass({

	mixins: [
	require('react-onclickoutside')
	],

	propTypes: {
		url: React.PropTypes.string,
		onRequestHide: React.PropTypes.func,
	},

	handleClickOutside: function(ev) {
		//this.props.onRequestHide();
	},

	render: function() {
		return  <img src={ this.props.url }/>
	}
});

module.exports = ImageForModal;
