/* frontpage.js
* what you see when you first login
* ye
* made by keivn altschuler
*/

'use strict';

// imports
var React = require('react');
var _ = require('underscore');

var router = require('./../../router');
var rbs = require('react-bootstrap');
var ModalTrigger = rbs.ModalTrigger;
var Tooltip = rbs.Tooltip;
var OverlayTrigger = rbs.OverlayTrigger;
var Button = rbs.Button;

var mui = require('material-ui');
var FontIcon = mui.FontIcon;
var FlatButton = mui.FlatButton;
var RaisedButton = mui.RaisedButton;

var ChatDock = require('./../../chat/components/ChatDock.jsx');
var CreateNewBevy = require('./../../bevy/components/CreateNewBevy.jsx');

var BevyStore = require('./../../bevy/BevyStore');
var UserStore = require('./../../profile/UserStore');

var AppActions = require('./../../app/AppActions');

var constants = require('./../../constants');

var HomeView = React.createClass({
	render: function() {
		return (
		<div className='landing-page'>
			<div className='landing-div div1'>
				<img src='./../../../img/logo_100_reversed.png'/>
				<div className='title-text'>
					Bevy
				</div>
				<div className='sub-title-text'>
					The Social Network For Your Community 
				</div>
				<div className='actions'>
					<RaisedButton linkButton={true} label='view bevies' href='/publicbevies'/>
					<ModalTrigger modal={
						<CreateNewBevy	/>
					}>
						<RaisedButton disabled={_.isEmpty(window.bootstrap.user)} label='New Bevy'/>
					</ModalTrigger>
				</div>
			</div>
			<div className='landing-div div2'>
				<div className='sub-title-text'>
					Inspired by Reddit, Forums, and Facebook Groups, Bevy is the logical progression of modern forums
				</div>
			</div>
			<div className='landing-div div3'>
				<div className='features-title'>
					The Feature Set For Your Community 
				</div>
				<div className='features'>
					<div className='feature'>
						<span className='glyphicon glyphicon-user'/>
						<div className='title'>
							Focused on Leaders
						</div>
						<div className='description'>
							Admin tools allow community leaders to easily manage their communities online presence.
						</div>
					</div>
					<div className='feature'>
						<span className='glyphicon glyphicon-calendar'/>
						<div className='title'>
							Event System
						</div>
						<div className='description'>
							A built in event manager allows communities to organize their next meetup.
						</div>
					</div>
					<div className='feature'>
						<span className='glyphicon glyphicon-modal-window'/>
						<div className='title'>
							Nested Bevies
						</div>
						<div className='description'>
							Bevy allows you to nest communities and enjoy all of them with less management.
						</div>
					</div>
					<div className='feature'>
						<span className='glyphicon glyphicon-king'/>
						<div className='title'>
							World Class Design
						</div>
						<div className='description'>
							Our amazing interface designers have crafted Bevy so even your grandma can use it.
						</div>
					</div>
				</div>
			</div>
			<div className='landing-div div4'/>
			<div className="footer-home">
				<div className='footer-left'>
					Bevy © 2015 
				</div>
				<div className='footer-right'>
					<Button className="bevy-logo-btn" href='/'>
						<div className='bevy-logo-img' style={{backgroundImage: 'url(/img/logo_100_reversed.png)'}}/>
					</Button>
				</div>
			</div>
		</div>
		);
	}
});

module.exports = HomeView;