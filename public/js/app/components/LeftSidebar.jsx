'use strict';

var React = require('react');

var $ = require('jquery');

var BevyList = require('./../../bevy/components/BevyList.jsx');

module.exports = React.createClass({

	propTypes: {
		allBevies: React.PropTypes.array.isRequired,
		activeBevy: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {};
	},

	render: function() {

		$(document).on("scroll", function(e) {
			var scrollTop = $(document).scrollTop();
			if(scrollTop > 128) {
				$('#left-sidebar-wrapper').addClass('fixed');
			} else {
				$('#left-sidebar-wrapper').removeClass('fixed');
			}
		});

		return	<div className='col-sm-3 left-sidebar'>
				 	<div className='panel left-sidebar-wrapper' id='left-sidebar-wrapper'>
						<BevyList
							allBevies={ this.props.allBevies }
							activeBevy={ this.props.activeBevy }
						/>
					</div>
				</div>;
	}
});
