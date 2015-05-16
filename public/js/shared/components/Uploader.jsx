/**
 * Uploader.jsx
 *
 * Dropzone upload component
 *
 * @author albert
 */

'use strict';

var React = require('react');
var Dropzone = require('dropzone');

var constants = require('./../../constants');

var Uploader = React.createClass({

	propTypes: {
		url: React.PropTypes.string,
		onUploadComplete: React.PropTypes.func,
		className: React.PropTypes.string,
		style: React.PropTypes.object,
		dropzoneOptions: React.PropTypes.object
	},

	componentDidMount: function() {

		// disable dropzone autodiscover
		Dropzone.autoDiscover = false;

		// instantiate dropzone
		this.dropzone = new Dropzone(this.getDOMNode(), {
			url : constants.apiurl + '/files/upload'
		});

		// set options
		Dropzone.options.uploader = this.props.dropzoneOptions;

		this.dropzone.on('success', function(file, response) {
			this.props.onUploadComplete(response);
		}.bind(this));
	},

	componentWillUnmount: function() {
		// remove files
		this.dropzone.removeAllFiles(true);
	},

	onDrop: function() {

	},

	render: function() {
		var children = this.props.children;

		var className = this.props.className || 'dropzone';

		var style = this.props.style || {
			width: this.props.size || '100%',
			height: this.props.size || '100%',
			minHeight: 100, };

		return <form className={ className } style={ style } id='uploader' />
	}

});

module.exports = Uploader;
