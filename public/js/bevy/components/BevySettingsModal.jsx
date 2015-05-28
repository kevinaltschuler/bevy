/**
 * BevySettingsModal.jsx
 *
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
var IconButton = mui.IconButton;
var Toggle = mui.Toggle;

var BevyActions = require('./../BevyActions');

var BevySettingsModal = React.createClass({

	propTypes: {
		activeBevy: React.PropTypes.object
	},

	save: function(ev) {
		var posts_expire_in = this.refs.posts_expire_in.getValue();
		var anonymise_users = this.refs.anonymise_users.isToggled();

		BevyActions.update(this.props.activeBevy._id, null, null, null, {
			posts_expire_in: posts_expire_in,
			anonymise_users: anonymise_users
		});

		this.props.onRequestHide();
	},

	render: function() {

		var bevy = this.props.activeBevy;
		var settings = bevy.settings;

		return <Modal className="bevy-settings-modal" { ...this.props }>
					<span className="title">Settings for {this.props.activeBevy.name}</span>

					<div className='bevy-setting'>
						Posts expire in
						<Input
							type='number'
							defaultValue={ settings.posts_expire_in }
							ref='posts_expire_in'
						/>
						 days
					</div>

					<div className='bevy-setting'>
						<Toggle
						  label="Anonymise Users?"
						  defaultToggled={ settings.anonymise_users }
						  ref='anonymise_users'
						/>
					</div>

					<div className='row'>
						<div className='col-xs-6'>
							<div className="panel-bottom">
								<RaisedButton
									onClick={ this.props.onRequestHide }
									label='Close' />
							</div>
						</div>
						<div className='col-xs-6'>
							<div className="panel-bottom">
								<RaisedButton
									onClick={ this.save }
									label='Save Changes' />
							</div>
						</div>
					</div>

				</Modal>
	}
});

module.exports = BevySettingsModal;
