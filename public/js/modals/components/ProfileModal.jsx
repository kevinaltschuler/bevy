'use strict';

var React = require('react');

var rbs = require('react-bootstrap');
var Modal = rbs.Modal;
var Button = rbs.Button;
var Input = rbs.Input;

var mui = require('material-ui');
var TextField = mui.TextField;

var name= 'Kevin Altschuler';
var email = 'kevinaltschuler@gmail.com';
var points = '123';
var bevys = '12';

var ProfileModal = React.createClass({
	render: function() {
		return <Modal className="profile-page" {...this.props} >

					<div className='row pro-pic'>
						<Button className="glyphicon glyphicon-camera"/>
					</div>

					<div className='row'>
						<TextField type="text" defaultValue={name} />
					</div>

					<div className='row'>
						<h2>{points} Points | {bevys} Bevys</h2>
					</div>

					<div className='row'>
						<h3>{email}</h3>
					</div>

				 </Modal>
	}
});

module.exports = ProfileModal;
