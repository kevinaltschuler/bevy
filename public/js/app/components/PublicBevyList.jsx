//public bevy list
//kevin is a homie
'use strict';

var React = require('react');
var _ = require('underscore');
var $ = require('jquery');

var CTG = React.addons.CSSTransitionGroup;

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
var OverlayTrigger = rbs.OverlayTrigger;
var Tooltip = rbs.Tooltip;

var mui = require('material-ui');
var RaisedButton = mui.RaisedButton;
var FontIcon = mui.FontIcon;
var FloatingActionButton = mui.FloatingActionButton;

var PostContainer = require('./../../post/components/PostContainer.jsx');
var LeftSidebar = require('./LeftSidebar.jsx');
var PublicBevyPanel = require('./../../bevy/components/PublicBevyPanel.jsx');
var CreateNewBevy = require('./../../bevy/components/CreateNewBevy.jsx');
var FilterSidebar = require('./FilterSidebar.jsx');
var PublicBevyList = require('./PublicBevyList.jsx');

var PublicBevyList = React.createClass({

	propTypes: {
		publicBevies: React.PropTypes.array.isRequired,
		myBevies: React.PropTypes.array,
		searchList: React.PropTypes.array,
		searchQuery: React.PropTypes.string
	},

	getInitialState: function() {
		return {
		};
	},

	render: function() {
		var publicBevies = this.props.publicBevies;
		var myBevies = this.props.myBevies;
		var searchList = this.props.searchList;
		var searchQuery = this.props.searchQuery;
		var bevies = publicBevies;
		if(!_.isEmpty(searchQuery)) {
			console.log('searching');
			bevies = searchList;
		}
		//console.log(collection);

		var publicBevyPanels = [];

		console.log('THE BEVIES', bevies);

		for(var key in bevies) {
			var bevy = bevies[key];
			publicBevyPanels.push(
				<PublicBevyPanel bevy={bevy} myBevies={this.props.myBevies} key={Math.random()} />
			);
		};

		var content = <CTG className='panel-list' transitionName="fadeIn">
				{publicBevyPanels}
			</CTG>;

		if(_.isEmpty(publicBevyPanels)) {
			content = <h2> no results :( </h2>
		}

		if(this.props.searchQuery == 'a8d27dc165db909fcd24560d62760868') {
			content = <section className="loaders"><span className="loader loader-quart"> </span></section>
		}


		return (<div className='public-bevy-wrapper'>
					<div className='mid-section'>
						<div className='public-bevy-list'>
							{/*<div className='public-bevy-header'>
								<div className='title'>
									<Button className='title-btn'>
										<h2>my bevies</h2>
									</Button>
									<h2 className='divider'>&nbsp;•&nbsp;</h2>
									<Button className='title-btn'>
										<h2>all bevies</h2>
									</Button>
								</div>
								<ModalTrigger modal={
									<CreateNewBevy	/>
								}>
									<RaisedButton disabled={_.isEmpty(window.bootstrap.user)} label='new bevy' className='public-bevy-panel panel'>
										<FontIcon className="glyphicon glyphicon-plus"/>
									</RaisedButton>
								</ModalTrigger>
							</div>*/}
							{content}
						</div>
						<FilterSidebar searchQuery={this.props.searchQuery} />
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
			</div>);
	}
});

module.exports = PublicBevyList;
