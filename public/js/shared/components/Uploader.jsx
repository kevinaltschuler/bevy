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
	},

	componentDidMount: function() {

		//var options = {};

		// disable dropzone autodiscover
		Dropzone.autoDiscover = false;

		// instantiate dropzone
		this.dropzone = new Dropzone(this.getDOMNode(), {
			url : constants.apiurl + '/files/upload'
		});

		this.dropzone.on('success', function(file, response) {
			this.props.onUploadComplete(response);
			//console.log(response);
		}.bind(this));
	},

	componentWillUnmount: function() {
		/*this.dropzone.destroy();
		this.dropzone = null;*/
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

		//

		/*return <div action='/' className={ className } style={ style } >
					<input style={{display: 'none' }} type='file' multiple ref='fileInput' onChange={this.onDrop} />
					{ this.props.children }
				 </div>*/
		//return <form className='dropzone' method='post' action={ constants.apiurl + '/files/upload' } />
		//
		return <form className={ className } style={ style } id='dropzone' />
	}

});

module.exports = Uploader;
