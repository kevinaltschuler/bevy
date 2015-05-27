/**
 * CreateNewBevy.jsx
 *
 * @author albert
 * @author kevin
 */

'use strict';

var React = require('react');
var _ = require('underscore');

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

	},

	getInitialState: function() {
		return {
			name: '',
			description: '',
			image_url: '',
		};
	},

	create: function(ev) {
		ev.preventDefault();

		var name = this.refs.name.getValue();
		var description = this.refs.description.getValue();

		if(_.isEmpty(name)) {
			this.refs.name.setErrorText('Please enter a name for your bevy');
			return;
		}

		BevyActions.create(name, description);

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
		var bevyImage = (_.isEmpty(this.state.image_url)) ? '/img/logo_100.png' : this.state.image_url;
		var bevyImageStyle = (this.state.image_url === '/img/logo_100.png')
		? {
			backgroundImage: 'url(' + bevyImage + ')',
			backgroundSize: '100px auto',

		}
		: {
			backgroundImage: 'url(' + bevyImage + ')',
			backgroundSize: '50px 50px',
		}

		return <Modal className="create-bevy" {...this.props} title="Create a New Bevy">

					<div className="row">
						<div className="col-xs-3 new-bevy-picture">
							<Uploader
								className="bevy-image-dropzone"
								style={ bevyImageStyle }
								dropzoneOptions={ dropzoneOptions }
							/>
						</div>
						<div className='col-xs-6'>
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

					<div className='row'>
						<div className='col-xs-12'>
							<div className="panel-bottom">
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
					</div>
				 </Modal>
	}
});

module.exports = CreateNewBevy;
