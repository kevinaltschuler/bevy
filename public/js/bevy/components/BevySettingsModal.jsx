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

	nameToggle: function(e, toggled) {
		BevyActions.update(this.props.activeBevy._id, null, null, null, {
			allow_changeable_names: toggled
		});
	},

	render: function() {

		return <Modal className="bevy-settings-modal" { ...this.props }>
					<span className="title">Settings for {this.props.activeBevy.name}</span>

					<div className='row bevy-setting'>
						<Toggle
						  label="Allow users to change their display name?"
						  defaultToggled={ this.props.activeBevy.settings.allow_changeable_names }
						  onToggle={ this.nameToggle } />
					</div>

					<div className='row'>
						<div className='col-xs-12'>
							<div className="panel-bottom">
								<RaisedButton
									onClick={ this.props.onRequestHide }
									label='Close' />
							</div>
						</div>
					</div>

				</Modal>
	}
});

module.exports = BevySettingsModal;
