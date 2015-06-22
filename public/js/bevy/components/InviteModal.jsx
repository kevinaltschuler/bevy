/**
 * InviteModal.jsx
 *
 * @author albert
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

var BevyActions = require('./../BevyActions');

var user = window.bootstrap.user;

// helper function to validate whether an email is valid
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var InviteModal = React.createClass({

	propTypes: {
		activeBevy: React.PropTypes.object,
	},

	getInitialState: function() {
		return {
			members: []
		};
	},

	addMember: function(ev) {
		ev.preventDefault();

		var memberName = this.refs.addMember.getValue();

		if(_.isEmpty(memberName) || !validateEmail(memberName)) {
			this.refs.addMember.setErrorText('Please enter a valid email address');
			return;
		}

		var members = this.state.members;
		members.push(memberName);
		this.setState({
			members: members
		});

		this.refs.addMember.clearValue();
	},

	invite: function(ev) {
		ev.preventDefault();

		// TODO: idiot proofing

		var bevy = this.props.activeBevy;
		var user = window.bootstrap.user;

		var members = this.state.members;
		if(members.length < 1) return;

		var activeMember = this.findMember();

		// send the invite and add the invited users
		BevyActions.invite(bevy, user, members, activeMember.displayName);

		// hide modal
		this.props.onRequestHide();
	},

	// triggered every time a key is pressed
	// updates the state
	handleChange: function(ev) {
		this.onKeyUp(ev);
	},

	// used to trigger the invite action (enter key)
	onKeyUp: function(ev) {
		//if the user hits enter, add name to  { members }
		if(ev.which === 13) {
			this.addMember(ev);
		}
	},

	findMember: function() {
		var members = this.props.activeBevy.members;
		return _.find(members, function(member) {
			if(_.isEmpty(member.user)) {
				// match email
				return member.email == user.email;
			} else {
				// match user id
				return member.user._id == user._id;
			}
		});
	},

	render: function() {

		var members = [];
		var allMembers = this.state.members;
		for(var key in allMembers) {
			var member = allMembers[key];
			members.push(
				<div key={ key }>
					<span className='member-item'>
						{ member }
					</span>
					<Button className="member-remove-btn">
						<span className="glyphicon glyphicon-remove"/>
					</Button>
					<br/>
				</div>
			);
		}

		return <Modal className="invite-modal" { ...this.props }>
					<span className="title">Invite New Members</span>

					<div className='row member-list'>
						<div className='col-xs-12'>
							{ members }
						</div>
					</div>

					<div className="row">
							<TextField
								type='text'
								ref='addMember'
								placeholder='Add Members...'
								onKeyUp={this.onKeyUp}/>
							<IconButton
								iconClassName="glyphicon glyphicon-plus"
								onClick={ this.addMember }
								label='Add Member'/>
					</div>

					<div className='row'>
						<div className='col-xs-12'>
							<div className="panel-bottom">
								<RaisedButton
									onClick={ this.invite }
									label="Invite"/>
								<FlatButton
									onClick={ this.props.onRequestHide }
									label="Cancel"/>
							</div>
						</div>
					</div>

				</Modal>
	}
});

module.exports = InviteModal;
