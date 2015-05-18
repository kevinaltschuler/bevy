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

var PostStore = require('./../../post/PostStore');

var constants = require('./../../constants');
var POST = constants.POST;

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
			url : constants.apiurl + '/files/upload',
			maxFiles: 1,
			acceptedFiles: 'image/*',
			thumbnailWidth: 500,
			thumbnailHeight: 500,
			dictDefaultMessage: 'Upload a File',
		});

		// set options
		//Dropzone.options.uploader = this.props.dropzoneOptions;
		Dropzone.options.uploader = {
			maxFiles: 1,
			acceptedFiles: 'image/*',
			//thumbnailWidth: 100,
			//thumbnailHeight: 100,
			dictDefaultMessage: 'Upload a File',
		};

		this.dropzone.on('success', function(file, response) {
			this.props.onUploadComplete(response);
		}.bind(this));

		PostStore.on(POST.POSTED_POST, this._onPosted);
		PostStore.on(POST.CANCELED_POST, this._onCanceled);
	},

	componentWillUnmount: function() {
		// remove files
		this.dropzone.removeAllFiles(true);

		PostStore.off(POST.POSTED_POST, this._onPosted);
		PostStore.off(POST.CANCELED_POST, this._onCanceled);
	},

	onDrop: function() {

	},

	_onPosted: function() {
		//console.log('post posted!');
		this.dropzone.removeAllFiles(true);
	},

	_onCanceled: function() {
		this.dropzone.removeAllFiles(true);
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
