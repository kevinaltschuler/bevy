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
		var options = this.props.dropzoneOptions;
		options.url = constants.apiurl + '/files/upload';
		this.dropzone = new Dropzone(this.getDOMNode(), options);

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
