//public bevy list
//kevin is a homie
'use strict';

var React = require('react');
var _ = require('underscore');
var $ = require('jquery');

var constants = require('./../../constants');
var router = require('./../../router');

var user = window.bootstrap.user;

var PostContainer = require('./../../post/components/PostContainer.jsx');
var LeftSidebar = require('./LeftSidebar.jsx');
var PublicBevyPanel = require('./../../bevy/components/PublicBevyPanel.jsx');

var SearchView = React.createClass({

	propTypes: {
		publicBevies: React.PropTypes.array.isRequired,
		allBevies: React.PropTypes.array.isRequired,
	},

	render: function() {
		var publicBevies = this.props.publicBevies;
		var allBevies = this.props.allBevies;

		var publicBevyPanels = [];

		for(var key in publicBevies) {
			var bevy = publicBevies[key];
			publicBevyPanels.push(
				<PublicBevyPanel bevy={bevy} allBevies={this.props.allBevies} />
			);
		};

		return (
			<div className='main-section'>
				<div className='public-bevy-list'>
					{publicBevyPanels}
				</div>
			</div>
		);
	}
});

module.exports = SearchView;
