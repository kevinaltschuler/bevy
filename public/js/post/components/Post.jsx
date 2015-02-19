/**
 * Post.jsx
 * React class for an individual post
 * Created en masse by PostContainer.jsx
 * @author albert
 */

'use strict';

// imports
var React = require('react');
var ReactPropTypes = React.PropTypes;

var mui = require('material-ui');
var IconButton = mui.IconButton;

// React class
var Post = React.createClass({

	// expects (most) of these to be passed in by PostContainer.jsx
	propTypes: {
		  title: ReactPropTypes.string
		, body: ReactPropTypes.string
		, image_url: ReactPropTypes.string
		, author: ReactPropTypes.string
		, bevy: ReactPropTypes.string
	},

	defaults: {
		// no need to set these, as they've already been set
		// by PostActions.js
	},

	getInitialState: function() {
		return {};
	},

	render: function() {
		return	<div className="panel">
						<div className="panel-heading">
							<a href={ this.props.image_url }>{ this.props.title }</a>
						</div>
						<div className="panel-details">{ this.props.author } • { this.props.bevy } • 12 hours ago</div>
						<div className="panel-body" tabIndex="0">
							<img className="panel-media" src={ this.props.image_url }/>
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
								<IconButton tooltip='upvote'>
									<span className="glyphicon glyphicon-menu-up btn" aria-hidden="true"></span>
								</IconButton>
							</div>
						</div>
					</div>
	}
});

module.exports = Post;
