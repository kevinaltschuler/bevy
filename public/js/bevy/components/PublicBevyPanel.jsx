/**
 * BevyPanel.jsx
 * formerly RightSidebar.jsx
 *
 * @author albert
 * @author kevin
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var constants = require('./../../constants');

var rbs = require('react-bootstrap');
var Badge = rbs.Badge;
var ButtonGroup = rbs.ButtonGroup;
var MenuItem = rbs.MenuItem;
var Accordion = rbs.Accordion;
var Panel = rbs.Panel;
var Button = rbs.Button;
var Input = rbs.Input;
var ModalTrigger = rbs.ModalTrigger;

var mui = require('material-ui');
var DropDownMenu = mui.DropDownMenu;
var IconButton = mui.IconButton;
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;
var FlatButton = mui.FlatButton;

var BevySettingsModal = require('./BevySettingsModal.jsx');

var BevyActions = require('./../BevyActions');

var Uploader = require('./../../shared/components/Uploader.jsx');

var NotificationHeader;

var user = window.bootstrap.user;

var PublicBevyPanel = React.createClass({

	propTypes: {
		bevy: React.PropTypes.object,
		myBevies: React.PropTypes.array.isRequired
	},

	getInitialState: function() {

		var bevy = this.props.bevy;
		var joined = _.findWhere(this.props.myBevies, { _id: bevy._id }) != undefined;

		return {
			name: bevy.name || '',
			description: bevy.description || '',
			image_url: bevy.image_url || '',
			joined: joined
		};
	},

	onRequestJoin: function(ev) {
		ev.preventDefault();

		BevyActions.join(this.props.bevy._id, window.bootstrap.user._id, window.bootstrap.user.email);

		var joined = true;

		this.setState({
			joined: joined
		});
	},

	onRequestLeave: function(ev) {
		ev.preventDefault();

		BevyActions.leave(this.props.bevy._id);

		var joined = false;

		this.setState({
			joined: joined
		});
	},

	render: function() {

		var bevy = this.props.bevy;
		var bevyImage = (_.isEmpty(this.state.image_url)) ? '/img/default_group_img.png' : this.state.image_url;
		var bevyImageStyle = {backgroundImage: 'url(' + bevyImage + ')'};
		var members = (_.isEmpty(bevy)) ? [] : bevy.members;


		var name = (_.isEmpty(bevy)) ? 'not in a bevy' : this.state.name;
		var description = (_.isEmpty(bevy)) ? 'no description' : this.state.description;
		if(_.isEmpty(description)) description = 'no description';

		var _joinButton = (this.state.joined)
		? <FlatButton label='leave' onClick={this.onRequestLeave} />
		: <RaisedButton label='join' onClick={this.onRequestJoin} /> 

		var joinButton = (_.isEmpty(window.bootstrap.user))
		? <div/>
		: _joinButton

		return (
			<div className="panel public-bevy-panel">
					<Button className="bevy-panel-top" href={'/b/' + this.props.bevy._id} style={bevyImageStyle}/>
					<div className='panel-info'>
						<div className='panel-info-top'>
								<a className='title' href={'/b/' + this.props.bevy._id}>
									{name}
								</a>
						</div>
						<div className='panel-info-bottom'>
							<div className='left'>
								<div>
									{description}
								</div>
								{/*<div>
									{ '0' + ' Members'}
								</div>
								<div>
									Created by: {bevyAdmin}
								</div>*/}
							</div>
							<div className='right'>
								{joinButton}
							</div>
						</div>
					</div>
			</div>
		);
	}
});
module.exports = PublicBevyPanel;
