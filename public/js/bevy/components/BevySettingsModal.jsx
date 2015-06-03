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
var DropDownMenu = mui.DropDownMenu;

var BevyActions = require('./../BevyActions');

var BevySettingsModal = React.createClass({

	propTypes: {
		activeBevy: React.PropTypes.object
	},

	getInitialState: function() {
		return {
			posts_expire_in: this.props.activeBevy.settings.posts_expire_in
		};
	},

	onDropDownChange: function(ev, selectedIndex, menuItem) {
		ev.preventDefault();

		this.setState({
			posts_expire_in: menuItem.payload
		});
	},

	save: function(ev) {
		var anonymise_users = this.refs.anonymise_users.isToggled();

		BevyActions.update(this.props.activeBevy._id, null, null, null, {
			anonymise_users: anonymise_users,
			posts_expire_in: this.state.posts_expire_in
		});

		this.props.onRequestHide();
	},

	render: function() {

		var bevy = this.props.activeBevy;
		var settings = bevy.settings;
		var expireMenuItems = [
			{ payload: '1', text: '1 day', defaultIndex: 0 },
			{ payload: '2', text: '2 days', defaultIndex: 1  },
			{ payload: '5', text: '5 days', defaultIndex: 2  },
			{ payload: '7', text: '7 days', defaultIndex: 3  }
		];
		var itemIndex = 0;
		var item = _.findWhere(expireMenuItems, { payload: this.state.posts_expire_in.toString() });
		if(!_.isEmpty(item)) {
			itemIndex = item.defaultIndex;
		}
		console.log(this.state.posts_expire_in, item, itemIndex);

		var posts_expire_in = this.state.posts_expire_in;

		return <Modal className="bevy-settings-modal" { ...this.props }>
					<span className="title">Settings for {this.props.activeBevy.name}</span>

					<div className='bevy-setting expire-setting'>
						Posts expire in
						<DropDownMenu
							ref='posts_expire_in'
							menuItems={ expireMenuItems }
							onChange={ this.onDropDownChange }
							selectedIndex={ itemIndex }
						/>
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
									label='Save' />
							</div>
						</div>
					</div>

				</Modal>
	}
});

module.exports = BevySettingsModal;
