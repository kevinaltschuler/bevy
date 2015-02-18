'use strict';

var React = require('react');
var ReactPropTypes = React.PropTypes;

var Post = React.createClass({

	propTypes: {
		  title: ReactPropTypes.string
		, body: ReactPropTypes.string
		, image_url: ReactPropTypes.string
		, author: ReactPropTypes.string
		, bevy: ReactPropTypes.string
	},

	defaults: {

	},

	getInitialState: function() {
		return {};
	},

	render: function() {
		return	<div className="panel">
						<div className="panel-heading">
							<a href="https://farm8.staticflickr.com/7363/9218137415_72af1b75b4_k.jpg">{ this.props.title }</a>
						</div>
						<div className="panel-details">Kevin Altschuler • Burlap • 12 hours ago</div>
						<div className="panel-body" tabIndex="0">
							<img className="panel-media" src="https://farm8.staticflickr.com/7363/9218137415_72af1b75b4_k.jpg"/>
						</div>
						<div className="panel-commments"></div>
						<div className="panel-bottom">
							<div className="panel-controls-left">
								1252 points<br/>53 comments
							</div>
							<div className="panel-controls-right">
								<span className="glyphicon glyphicon-menu-up btn" aria-hidden="true"></span>&nbsp;&nbsp;
								<span className="glyphicon glyphicon-menu-down btn" aria-hidden="true"></span>&nbsp;&nbsp;
								<span className="glyphicon glyphicon-option-vertical btn" aria-hidden="true"></span>
							</div>
						</div>
					</div>
	}
});

module.exports = Post;
