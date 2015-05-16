/**
 * CommentItem.jsx
 *
 * @author albert
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var timeAgo = require('./../../shared/helpers/timeAgo');

var CommentSubmit = require('./CommentSubmit.jsx');

var CommentItem = React.createClass({

	propTypes: {
		index: React.PropTypes.string,
		comment: React.PropTypes.object,

		postId: React.PropTypes.string,
		author: React.PropTypes.object,
		profileImage: React.PropTypes.string
	},

	getInitialState: function() {
		return {
			isReplying: false
		};
	},

	onReply: function(ev) {
		ev.preventDefault();

		this.setState({
			isReplying: !this.state.isReplying
		});
	},

	render: function() {

		var defaultAliasImage = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';

		var comment = this.props.comment;
		var author = comment.author;
		var authorName = (author.google)
		? author.google.name.givenName + ' ' + author.google.name.familyName
		: author.email;

		var replyText = (this.state.isReplying)
		? 'close'
		: 'reply';

		var submit = (this.state.isReplying)
		? (<CommentSubmit
				postId={ this.props.postId }
				commentId={ comment._id }
				author={ this.props.author }
				profileImage={ this.props.profileImage }
			/>)
		: <div />;

		return (<div className="row comment">
					<div className='col-xs-12'>
						<img className="profile-img" src={ defaultAliasImage }/>
						<div className="comment-text">
							<div className="comment-title">
								<a className="comment-name">{ authorName }</a>
								<span>&nbsp;</span>
								<text className="detail-time">{ timeAgo(Date.parse(comment.created)) }</text>
							</div>
							<div className="comment-body">{ comment.body }</div>
							{/*<a className="reply-link" onClick={ this.onReply }>{ replyText }</a>*/}
						</div>
					</div>
					{ submit }
				 </div>)
	}

});

module.exports = CommentItem;
