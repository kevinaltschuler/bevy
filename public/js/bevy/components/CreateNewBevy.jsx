/**
 * CreateNewBevy.jsx
 *
 * @author albert
 * @author kevin
 */

'use strict';

var React = require('react');
var _ = require('underscore');
var constants = require('./../../constants');

var rbs = require('react-bootstrap');
var Panel = rbs.Panel;
var Input = rbs.Input;
var Button = rbs.Button;
var Modal = rbs.Modal;

var mui = require('material-ui');
var FlatButton = mui.FlatButton;
var RaisedButton = mui.RaisedButton;
var TextField = mui.TextField;

var BevyActions = require('./../BevyActions');
var Uploader = require('./../../shared/components/Uploader.jsx');

var user = window.bootstrap.user;

var CreateNewBevy = React.createClass({

	propTypes: {
		parent: React.PropTypes.object
	},

	getInitialState: function() {
		var parent_id = (this.props.parent == undefined) ? undefined : this.props.parent._id;
		var disabled = _.isEmpty(window.bootstrap.user);

		return {
			name: '',
			description: '',
			image_url: '',
			parent_id: parent_id
		};
	},

	onUploadComplete: function(file) {
		var filename = file.filename;
		var image_url = constants.apiurl + '/files/' + filename
		this.setState({
			image_url: image_url,
		});
	},

	create: function(ev) {
		ev.preventDefault();

		var name = this.refs.name.getValue();
		var description = this.refs.description.getValue();
		var image_url = this.state.image_url;
		var parent_id = this.state.parent_id;

		if(_.isEmpty(name)) {
			this.refs.name.setErrorText('Please enter a name for your bevy');
			return;
		}

		BevyActions.create(name, description, image_url, [], parent_id);

		// after, close the window
		this.props.onRequestHide();
	},

	render: function() {

		var dropzoneOptions = {
			maxFiles: 1,
			acceptedFiles: 'image/*',
			clickable: '.dropzone-panel-button',
			dictDefaultMessage: ' ',
		};
		var bevyImage = (_.isEmpty(this.state.image_url)) ? '/img/default_group_img.png' : this.state.image_url;
		var bevyImageStyle = {
			backgroundImage: 'url(' + bevyImage + ')',
			backgroundSize: '100% auto'

		};

		var title = (this.props.parent )
		? 'Create a new Sub Bevy of ' + this.props.parent.name
		: 'Create a New Bevy'

		return <Modal className="create-bevy" {...this.props} title={title}>

					<div className="bevy-info">
						<div className="new-bevy-picture">
							<Uploader
								onUploadComplete={ this.onUploadComplete }
								className="bevy-image-dropzone"
								style={ bevyImageStyle }
								dropzoneOptions={ dropzoneOptions }
							/>
						</div>
						<div className='text-fields'>
							<TextField
								type='text'
								ref='name'
								placeholder='Group Name'
							/>
							<TextField
								type='text'
								ref='description'
								placeholder='Group Description'
							/>
						</div>
					</div>
					<div className="panel-bottom">
						<div className='right'>
							<RaisedButton
								onClick={ this.create }
								label="Create"
							/>
							<FlatButton
								onClick={ this.props.onRequestHide }
								label="Cancel"
							/>
						</div>
					</div>
				 </Modal>
	}
});

module.exports = CreateNewBevy;
