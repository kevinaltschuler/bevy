/**
 * CommentSubmit.jsx
 *
 * @author albert
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var mui = require('material-ui');
var IconButton = mui.IconButton;
var TextField = mui.TextField;

var CommentSubmit = React.createClass({

	propTypes: {
		profileImage: React.PropTypes.string
	},

	render: function() {
		return (<div className="panel-comment-input">
						<div className="profile-overlay"/>
						<img className="profile-img" src={ this.props.profileImage }/>
						<TextField className="panel-comment-textfield" hintText="Write a Comment"/>
					</div>);
	}

});

module.exports = CommentSubmit;
