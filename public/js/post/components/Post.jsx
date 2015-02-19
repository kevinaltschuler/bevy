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

var PostActions = require('./../PostActions');

// React class
var Post = React.createClass({

	// expects (most) of these to be passed in by PostContainer.jsx
	propTypes: {
		  id: ReactPropTypes.number
		, title: ReactPropTypes.string
		, body: ReactPropTypes.string
		, image_url: ReactPropTypes.string
		, author: ReactPropTypes.string
		, bevy: ReactPropTypes.string
		, comments: ReactPropTypes.array
		, points: ReactPropTypes.array
	},

	defaults: {
		// no need to set these, as they've already been set
		// by PostActions.js
	},

	getInitialState: function() {
		return {};
	},

	upvote: function(ev) {
		ev.preventDefault();
		PostActions.upvote(this.props.id, this.props.author);
	},

	downvote: function(ev) {
		ev.preventDefault();
		PostActions.downvote(this.props.id, this.props.author);
	},

	countVotes: function() {
		var sum = 0;
		this.props.points.forEach(function(vote) {
			sum += vote.value;
		});
		return sum;
	},

	render: function() {
		//TODO: fix if logic
		if(false) {
			return	<div className="panel" postId={ this.props.id }>
							<div className="panel-heading">
								<a href={ this.props.image_url }>{ this.props.title }</a>
							</div>
							<div className="panel-details">{ this.props.author } • { this.props.bevy } • 12 hours ago</div>
							<div className="panel-body panel-body-image" tabIndex="0">
								<img className="panel-media" src={ this.props.image_url }/>
							</div>
							<div className="panel-commments"></div>
							<div className="panel-bottom">
								<div className="panel-controls-left">
									{ this.countVotes() } points<br/>{ this.props.comments.length } comments
								</div>
								<div className="panel-controls-right">
									<IconButton tooltip='upvote'>
										<span className="glyphicon glyphicon-menu-up btn" onClick={ this.upvote }></span>
									</IconButton>
									<IconButton tooltip='downvote'>
										<span className="glyphicon glyphicon-menu-down btn" onClick={ this.downvote }></span>
									</IconButton>
									<span className="glyphicon glyphicon-option-vertical btn"></span>
								</div>
							</div>
						</div>
				}
		else {
			return  <div className="panel" postId={ this.props.id }>
							<div className="panel-heading">
								<a href={ this.props.image_url }>{ this.props.title }</a>
							</div>
							<div className="panel-details">{ this.props.author } • { this.props.bevy } • 12 hours ago</div>
							<div className="panel-body panel-body-text" tabIndex="0">
								Nuts nuts nuts nuts nuts nuts nuts nuts nuts nuts nuts 
								nuts nuts nuts nuts nuts nuts nuts nuts nuts nuts nuts 
								nuts nuts nuts nuts nuts nuts nuts nuts nuts nuts nuts nuts 
								nuts nuts nuts nuts nuts nuts nuts nuts nuts nuts nuts nuts nuts nuts nuts 
								nuts nuts nuts nuts nuts nuts nuts nuts nuts nuts nuts nuts 
								nuts nuts nuts nuts nuts nuts nuts nuts nuts 
							</div>
							<div className="panel-commments"></div>
							<div className="panel-bottom">
								<div className="panel-controls-left">
									{ this.countVotes() } points<br/>{ this.props.comments.length } comments
								</div>
								<div className="panel-controls-right">
									<IconButton tooltip='upvote'>
										<span className="glyphicon glyphicon-menu-up btn" onClick={ this.upvote }></span>
									</IconButton>
									<IconButton tooltip='downvote'>
										<span className="glyphicon glyphicon-menu-down btn" onClick={ this.downvote }></span>
									</IconButton>
									<span className="glyphicon glyphicon-option-vertical btn"></span>
								</div>
							</div>
						</div>
		}
	}
});

module.exports = Post;
