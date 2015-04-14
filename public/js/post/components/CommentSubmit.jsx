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

var rbs = require('react-bootstrap');
var Button = rbs.Button;

var COMMENT = require('./../../constants').COMMENT;
var CommentActions = require('./../CommentActions');

var CommentSubmit = React.createClass({

	propTypes: {
		author: React.PropTypes.object,
		profileImage: React.PropTypes.string
	},

	submit: function() {
		var author = this.props.author;
		var body = this.refs.body.getValue();

		CommentActions.create(author, body);
	},

	onKeyPress: function(ev) {
		if(ev.which == 13) { // enter key
			//console.log('submit');
			this.submit();
		}
	},

	render: function() {
		return (<div className="panel-comment-input">
						<div className="profile-overlay"/>
						<img className="profile-img" src={ this.props.profileImage }/>
						<TextField
							className="panel-comment-textfield"
							hintText="Write a Comment"
							ref='body'
							onKeyPress={ this.onKeyPress }
						/>
						<Button
							onClick={ this.submit } >
							Submit
						</Button>

					</div>);
	}

});

module.exports = CommentSubmit;
