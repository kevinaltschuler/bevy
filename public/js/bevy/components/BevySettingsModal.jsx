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

	nameToggle: function() {

	},

	render: function() {

		var canChangeName = true;

		return <Modal className="bevy-settings-modal">
					<span className="title">Settings for {this.props.activeBevy.name}</span>

					<div className='row bevy-setting'>
						<Toggle
						  name="toggleName1"
						  value="toggleValue1"
						  label="Allow users to change their display name?"
						  onToggle = { this.nameToggle }/>
					</div>

					<div className='row'>
						<div className='col-xs-12'>
							<div className="panel-bottom">
								<RaisedButton
									onClick={this.props.onRequestHide}
									label='Close' />
							</div>
						</div>
					</div>

				</Modal>
	}
});

module.exports = BevySettingsModal;
