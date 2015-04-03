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

// helper function to validate whether an email is valid
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var CreateNewBevy = React.createClass({

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

	create: function(ev) {
		ev.preventDefault();

		var name = this.refs.name.getValue();

		if(_.isEmpty(name)) {
			this.refs.name.setErrorText('Please enter a name for your bevy');
			return;
		}

		var members = this.state.members;

		/*if(_.isEmpty(members)) {
			this.refs.addMember.setErrorText('Please add a member to this bevy');
			return;
		}*/



		BevyActions.create(name, members);

		// after, close the window
		this.props.onRequestHide();
	},

	render: function() {

		var members = [];
		var allMembers = this.state.members;
		for(var key in allMembers) {
			var member = allMembers[key];
			members.push(<div key={ key }>
								<span className='member-item'>
									{ member }
								</span>
								<br/>
							</div>);
		}


		return	<Modal className="create-bevy" {...this.props} title="Create a New Bevy">

						<div className="row">
							<div className='col-xs-12'>
								<TextField
									type='text'
									ref='name'
									placeholder='Group Name' />
							</div>
						</div>

						<div className="row">
							<div className='col-xs-8'>
								<TextField
									type='text'
									ref='addMember'
									placeholder='Add Members...' />
							</div>
							<div className='col-xs-4'>
								<RaisedButton
									onClick={ this.addMember }
									label='Add Member'/>
							</div>
						</div>

						<div className='row'>
							<div className='col-xs-12'>
								{ members }
							</div>
						</div>

						<div className='row'>
							<div className='col-xs-12'>
								<div className="panel-bottom">
									<RaisedButton
										onClick={ this.create }
										label="Create"/>
									<FlatButton
										onClick={ this.props.onRequestHide }
										label="Cancel"/>
								</div>
							</div>
						</div>
					</Modal>
	}
});

module.exports = CreateNewBevy;
