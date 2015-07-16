//public bevy list
//kevin is a homie
'use strict';

var React = require('react');
var _ = require('underscore');
var $ = require('jquery');

var constants = require('./../../constants');
var router = require('./../../router');

var user = window.bootstrap.user;

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
var RaisedButton = mui.RaisedButton;
var FontIcon = mui.FontIcon;

var PostContainer = require('./../../post/components/PostContainer.jsx');
var LeftSidebar = require('./LeftSidebar.jsx');
var PublicBevyPanel = require('./../../bevy/components/PublicBevyPanel.jsx');
var CreateNewBevy = require('./../../bevy/components/CreateNewBevy.jsx');

var SearchView = React.createClass({

	propTypes: {
		publicBevies: React.PropTypes.array.isRequired,
		myBevies: React.PropTypes.array
	},

	render: function() {
		var publicBevies = this.props.publicBevies;
		var myBevies = this.props.myBevies;

		var publicBevyPanels = [];

		for(var key in publicBevies) {
			var bevy = publicBevies[key];
			publicBevyPanels.push(
				<PublicBevyPanel bevy={bevy} myBevies={this.props.myBevies} />
			);
		};

		return (
			<div className='public-bevy-wrapper'>
				<div className='mid-section'>
					<div className='public-bevy-list'>
						<div className='public-bevy-header'>
							<h2>
								Bevies
							</h2>
							<ModalTrigger modal={
								<CreateNewBevy	/>
							}>
								<RaisedButton disabled={_.isEmpty(window.bootstrap.user)} label='new bevy' className='public-bevy-panel panel'>
									<FontIcon className="glyphicon glyphicon-plus"/>
								</RaisedButton>
							</ModalTrigger>
						</div>
						<div className='panel-list'>
								{publicBevyPanels}
						</div>
					</div>
				</div>
				<div className="footer-public-bevies">
					<div className='footer-left'>
						Bevy © 2015 
					</div>
					<div className='footer-right'>
						<Button className="bevy-logo-btn" href='/'>
							<div className='bevy-logo-img' style={{backgroundImage: 'url(/img/logo_100.png)'}}/>
						</Button>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = SearchView;
